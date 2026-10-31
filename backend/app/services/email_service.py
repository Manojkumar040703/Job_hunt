import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.core.config import settings
from app.models.entities import EmailDeliveryRecord

def send_email_notification(
    db: Session,
    recipient_email: str,
    recipient_name: str,
    subject: str,
    template_type: str,
    body_text: str,
    body_html: str = None
) -> bool:
    """
    Sends an email notification via SMTP if configured, 
    otherwise performs verified local simulation logging.
    Records every attempt in the database EmailDeliveryRecord table.
    """
    status = "Pending"
    error_msg = None

    if settings.SMTP_HOST and settings.SMTP_USER and settings.SMTP_PASSWORD:
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = f"{settings.EMAILS_FROM_NAME} <{settings.EMAILS_FROM_EMAIL}>"
            msg["To"] = recipient_email

            part1 = MIMEText(body_text, "plain")
            msg.attach(part1)

            if body_html:
                part2 = MIMEText(body_html, "html")
                msg.attach(part2)

            server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10)
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(settings.EMAILS_FROM_EMAIL, [recipient_email], msg.as_string())
            server.quit()
            status = "Sent"
        except Exception as e:
            status = "Failed"
            error_msg = str(e)
            print(f"[Email Service Error] Failed to send email to {recipient_email}: {e}")
    else:
        # Development / Local mode: Log delivery to audit records
        status = "Sent (Simulated)"
        safe_subject = subject.encode("ascii", errors="replace").decode()
        safe_name = recipient_name.encode("ascii", errors="replace").decode() if recipient_name else ""
        print(f"\n==================== [JOB HUNT EMAIL DISPATCH] ====================")
        print(f"TO: {safe_name} <{recipient_email}>")
        print(f"SUBJECT: {safe_subject}")
        print(f"TYPE: {template_type}")
        print(f"==================================================================\n")

    # Always persist in database
    try:
        record = EmailDeliveryRecord(
            recipient_email=recipient_email,
            recipient_name=recipient_name,
            subject=subject,
            template_type=template_type,
            status=status,
            error_message=error_msg,
            sent_at=datetime.now(timezone.utc)
        )
        db.add(record)
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"[Email Record Error] Could not save email delivery record: {e}")

    return status in ["Sent", "Sent (Simulated)"]

def send_interview_invitation_email(
    db: Session,
    candidate_email: str,
    candidate_name: str,
    company: str,
    role: str,
    round_name: str,
    date: str,
    time: str,
    meet_url: str,
    instructions: str
):
    subject = f"Interview Scheduled: {role} at {company} — Job Hunt Tamil Nadu"
    body_text = f"""Dear {candidate_name},

Congratulations! An interview has been scheduled for your application with {company} via Job Hunt.

Position: {role}
Round: {round_name}
Date: {date}
Time: {time}
Meeting Link: {meet_url or 'Details sent separately / On-site'}
Instructions:
{instructions or 'Please join 5 minutes early with your portfolio and ID.'}

Best regards,
Talent Acquisition Team at {company}
Dispatched via Job Hunt Tamil Nadu
"""
    return send_email_notification(
        db=db,
        recipient_email=candidate_email,
        recipient_name=candidate_name,
        subject=subject,
        template_type="interview",
        body_text=body_text
    )

def send_selection_email(
    db: Session,
    candidate_email: str,
    candidate_name: str,
    company: str,
    role: str,
    details: str
):
    subject = f"Congratulations! You Have Been Selected for {role} at {company} - Job Hunt"
    body_text = f"""Dear {candidate_name},

We are thrilled to inform you that your application for {role} at {company} has been marked as SELECTED!

Details from the recruiter:
{details or 'The HR department will reach out shortly with your formal offer letter and onboarding schedule.'}

Please log in to your Job Hunt dashboard at any time to view your updated status and next steps.

Hearty Congratulations,
{company} Hiring Team & Job Hunt Tamil Nadu
"""
    return send_email_notification(
        db=db,
        recipient_email=candidate_email,
        recipient_name=candidate_name,
        subject=subject,
        template_type="selection",
        body_text=body_text
    )

def send_rejection_email(
    db: Session,
    candidate_email: str,
    candidate_name: str,
    company: str,
    role: str,
    feedback: str = ""
):
    subject = f"Update regarding your application for {role} at {company}"
    body_text = f"""Dear {candidate_name},

Thank you for your interest in the {role} position at {company} and for the time you invested in the application process.

After careful review, the hiring team has decided to proceed with other candidates whose profiles more closely match our current requirements.

Your profile remains active on Job Hunt, and we encourage you to explore other verified opportunities across Tamil Nadu.

Sincerely,
{company} Recruitment Team
"""
    return send_email_notification(
        db=db,
        recipient_email=candidate_email,
        recipient_name=candidate_name,
        subject=subject,
        template_type="rejection",
        body_text=body_text
    )
