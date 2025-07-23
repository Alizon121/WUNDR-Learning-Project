import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail


async def send_email(to: str, subject: str, content: str):
    message = Mail(
        # ! DO WE NEED A REAL EMAIL TO SEND THIS FROM??
        from_email='noreply@wonderhood.app',
        to_emails=to,
        subject=subject,
        plain_text_content=content
    )

    """
    Helper function to generate email for password reset
    """

    try:
        sg = SendGridAPIClient(os.getenv("SENDGRID_API_KEY"))
        response = sg.send(message)
        return response

    except Exception as e:
        print(f"SendGrid error: {str(e)}")
