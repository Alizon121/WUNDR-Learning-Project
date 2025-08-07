# WUNDR backend Instructions

## Getting Started with development environment

1. Ensure running from backend directory and:

    - Activate virtual environment for Python 12 inside of the backend directory: 

        pyenv install 3.12.7
        pyenv local 3.12.7

    - Install dependecies: 
        
        pip install -r requirements.txt

2. Run Prisma commands:

        prisma generate
        prisma db push
        Clear PyCache using: find . -name "*.pyc" -delete

3. Run the development server from the ROOT directory using:

        uvicorn backend.main:app --reload

    - After starting the server, navigate to http://127.0.0.1:8000/ on your local device to being viewing endpoint responses.
    -Navigate to http://127.0.0.1:8000/docs for interactive API docs.

# Deploy on ...

ADD INSTRUCTIONS FOR HOW WE ARE DELPOYING HERE