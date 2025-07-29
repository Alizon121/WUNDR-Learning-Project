def send_confirmation_message(
        event_name: str,
        event_date: str
        ):
            return f'You have successfully scheduled for {event_name} on {event_date}. We will send a reminder one day before the event occurs. We hope to see you there!'

def send_notification_confirmation(
        event_name: str,
        event_date: str,
        event_id: str
        ):
            message = send_confirmation_message(event_name, event_date)
            print(f"Sending to user linked with event {event_id}: {message}")