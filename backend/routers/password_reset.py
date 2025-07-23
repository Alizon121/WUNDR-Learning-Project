from fastapi import APIRouter, Depends, HTTPException, status
from db.prisma_client import db
from models.user_models import PasswordResetRequest, PasswordResetPayload
from auth.utils import hash_password
from utils.email import send_email
from datetime import datetime, timedelta
from jose import jwt, ExpiredSignatureError, JWTError
from dotenv import load_dotenv
import os


router = APIRouter()
load_dotenv()


ALGORITHM = "HS256"
SECRET_KEY = os.getenv("SECRET_KEY")


@router.post("/forgot-password", status_code=status.HTTP_200_OK)
async def forgot_password(request: PasswordResetRequest):

    """
    Initiatest password reset process

    Generates JWT reset token
    Sends token to user email via SendGrid
    """

    # Get the user
    user = await db.users.find_unique(
        where={"email": request.email}
    )

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Generate the JWT
    expiration = datetime.utcnow() + timedelta(minutes=30)

    reset_token = jwt.encode(
        {
            "sub": user.email,
            "exp": expiration
        },
        SECRET_KEY,
        ALGORITHM
    )

    # Send the email
    await send_email(
        to=user.email,
        subject="Wonderhood Password Reset",
        content=f"Click here to reset your password: https://wonderhood.app/reset-password?token={reset_token}"
    )

    return {"message": "Reset password link has been sent to your email"}


@router.post("/reset-password", status_code=status.HTTP_200_OK)
async def reset_password(payload: PasswordResetPayload):

    """
    Completes Password Reset

    Decodes JWT token and validates expiration
    Hashes the new password
    Updates user password in the DB
    """

    # Decode the token
    try:
        decoded = jwt.decode(payload.token, SECRET_KEY, algorithms=[ALGORITHM])
        email = decoded.get("sub")

        if not email:
            raise HTTPException(
                status_code=400,
                detail="Invalid token payload"
            )

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Reset token has expired")

    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid reset token")

    # Get the user
    user = await db.users.find_unique(where={"email": email})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Hash the new password
    hashed_pw = hash_password(payload.new_password)

    # Update the password
    await db.users.update(
        where={"email": email},
        data={"password": hashed_pw}
    )
