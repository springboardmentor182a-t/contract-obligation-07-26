import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")

def send_otp_email(to_email: str, otp_code: str):
    """
    Sends a 6-digit OTP to the user's email via smtplib.
    Always logs to console for development, and attempts real SMTP if credentials exist.
    Returns (success: bool, real_smtp_sent: bool, info_message: str).
    """
    print("\n" + "="*55)
    print(f"[AUTH/SECURITY] Password Reset OTP for {to_email}: {otp_code}")
    print(f"[AUTH/SECURITY] Expiry: 10 minutes from now (PostgreSQL DB Synced)")
    print("="*55 + "\n")

    # Check if SMTP credentials are real and not placeholder
    is_placeholder = (
        not SMTP_USER or 
        not SMTP_PASSWORD or 
        "your_email" in SMTP_USER.lower() or 
        "your_app_password" in SMTP_PASSWORD.lower()
    )

    if is_placeholder:
        print(f"[AUTH/SMTP] Notice: Real SMTP credentials not configured in .env. Falling back to secure in-app/console OTP code.")
        return True, False, "Console fallback (SMTP not configured in server/.env)"

    try:
        msg = MIMEMultipart("alternative")
        msg['To'] = to_email
        msg['From'] = SMTP_USER
        msg['Subject'] = "ContractIQ - Password Reset OTP Code"

        plain_text = f"""Hello,

You requested a password reset for your ContractIQ Enterprise account ({to_email}).

Your 6-digit verification code (OTP) is: {otp_code}

This code is valid for 10 minutes. If you did not make this request, please disregard this email.

Best regards,
ContractIQ Security Team
"""

        html_text = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a; color: #f8fafc; margin: 0; padding: 20px; }}
    .card {{ max-width: 500px; margin: 0 auto; background-color: #161f2e; border: 1px solid #334155; border-radius: 12px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }}
    .header {{ text-align: center; margin-bottom: 24px; }}
    .logo {{ color: #3b82f6; font-size: 24px; font-weight: bold; letter-spacing: 0.5px; }}
    .otp-box {{ background-color: #0f172a; border: 2px dashed #3b82f6; border-radius: 8px; text-align: center; padding: 18px; margin: 24px 0; }}
    .otp-code {{ font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #60a5fa; margin: 0; }}
    .footer {{ font-size: 12px; color: #94a3b8; text-align: center; margin-top: 24px; border-top: 1px solid #334155; padding-top: 16px; }}
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="logo">ContractIQ Enterprise</div>
      <h2 style="color: #ffffff; margin-top: 12px; font-size: 20px;">Password Reset Verification</h2>
    </div>
    <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
      We received a request to reset your password for <strong>{to_email}</strong>. Use the 6-digit verification code below:
    </p>
    <div class="otp-box">
      <div class="otp-code">{otp_code}</div>
    </div>
    <p style="color: #94a3b8; font-size: 13px; text-align: center;">
      This code expires in <strong>10 minutes</strong>.
    </p>
    <div class="footer">
      If you did not request a password reset, please contact your administrator.<br>
      (c) 2026 ContractIQ. All rights reserved.
    </div>
  </div>
</body>
</html>"""

        msg.attach(MIMEText(plain_text, 'plain', 'utf-8'))
        msg.attach(MIMEText(html_text, 'html', 'utf-8'))

        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT, timeout=10)
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()
        print(f"[AUTH/SMTP] Successfully delivered OTP email to {to_email}")
        return True, True, "Email delivered successfully"
    except Exception as e:
        print(f"[AUTH/SMTP] Email delivery failed ({e}). Fallback OTP available in console.")
        return True, False, f"SMTP delivery error: {e}"

def send_reset_email(to_email: str, reset_link: str):
    print(f"[AUTH] Reset link for {to_email}: {reset_link}")
    return True, False, "Console fallback"
