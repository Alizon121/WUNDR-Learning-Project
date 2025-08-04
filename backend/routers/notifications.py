# from fastapi import FastAPI
# from db.prisma_client import db


import yagmail

def send_confirmation_message(
        event_name: str,
        event_date: str,
        user_id: str
        ):
            '''
                Function for handling sending a confirmation message to user after enrolling to an event
            '''

            message = f'You have successfully scheduled for {event_name} on {event_date}. We will send a reminder one day before the event occurs. We hope to see you there!'
            print(f"[Notification -> {user_id}: {message}]")

def deliver_confirmation(
    event_id: str,
    event_name: str,
    event_date: str,
    user_email: str  # you’ll need to fetch this in your route
):
    message = send_confirmation_message(event_name, event_date)

    yag = yagmail.SMTP("you@gmail.com", "your-app-password")
    yag.send(
        to=user_email,
        subject=f"Confirmation: {event_name}",
        contents=message
    )

# def schedule_confirmation(
#     event_name: str,
#     event_date: str,
#     user_id: str,
#     background_tasks: BackgroundTasks,
   
# ):
#     background_tasks.add_task(
#         send_notification_confirmation,
#         event_name,
#         event_date,
#         user_id
#     )