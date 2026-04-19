import os
import smtplib
from email.message import EmailMessage

SMTP_HOST = os.getenv('SMTP_HOST')
SMTP_PORT = int(os.getenv('SMTP_PORT', '587'))
SMTP_USER = os.getenv('SMTP_USER')
SMTP_PASS = os.getenv('SMTP_PASS')
EMAIL_FROM = os.getenv('EMAIL_FROM', SMTP_USER)


def send_email(to: str, subject: str, body: str):
    if not SMTP_HOST or not SMTP_USER or not SMTP_PASS:
        # If not configured, skip sending but log
        print('SMTP not configured; skipping email send to', to)
        return False

    msg = EmailMessage()
    msg['Subject'] = subject
    msg['From'] = EMAIL_FROM
    msg['To'] = to
    msg.set_content(body)

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as s:
        s.starttls()
        s.login(SMTP_USER, SMTP_PASS)
        s.send_message(msg)

    return True
