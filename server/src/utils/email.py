import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import requests
from dotenv import load_dotenv

load_dotenv()

SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")

_ethereal_account = None

def get_ethereal_account():
    global _ethereal_account
    if _ethereal_account: return _ethereal_account
    print("Provisioning Ethereal test account...")
    try:
        resp = requests.post("https://api.nodemailer.com/user", json={"requestor": "ContractIQ", "version": "1.0"})
        if resp.status_code == 200:
            _ethereal_account = resp.json()
            return _ethereal_account
    except Exception as e:
        print("Ethereal provision error:", e)
    return None

def send_reset_email(to_email: str, reset_link: str):
    msg = MIMEMultipart()
    msg['To'] = to_email
    msg['Subject'] = "ContractIQ - Password Reset Request"
    body = f"Hello,\n\nPlease click the following link to reset your password:\n{reset_link}\n\nIf you did not request this, please ignore this email."
    msg.attach(MIMEText(body, 'plain'))

    host = SMTP_SERVER
    port = SMTP_PORT
    user = SMTP_USER
    password = SMTP_PASSWORD
    ethereal_url = None

    if not user or not password or user == "your_email@gmail.com":
        # Fallback to Ethereal
        account = get_ethereal_account()
        if not account:
            return False, "Failed to provision test email account."
        host = account['smtp']['host']
        port = account['smtp']['port']
        user = account['user']
        password = account['pass']
        ethereal_url = account['web']

    msg['From'] = user

    try:
        server = smtplib.SMTP(host, port)
        server.starttls()
        server.login(user, password)
        server.send_message(msg)
        server.quit()
        if ethereal_url:
            return True, ethereal_url
        return True, None
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False, str(e)
