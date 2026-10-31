import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.entities import PaymentTransaction, CourseEnrollment, Course, User
from app.api.deps import get_current_authenticated_user

router = APIRouter(prefix="/payments", tags=["Payments & Gateway"])

class CreateOrderRequest(BaseModel):
    course_id: str
    amount: int
    payment_method: str = "UPI" # UPI, Google Pay, Paytm, Card

class VerifyPaymentRequest(BaseModel):
    order_id: str
    upi_ref: Optional[str] = None
    gateway_signature: Optional[str] = None

@router.post("/orders")
def create_payment_order(
    data: CreateOrderRequest,
    current_user: User = Depends(get_current_authenticated_user),
    db: Session = Depends(get_db)
):
    course = db.query(Course).filter(Course.id == data.course_id).first()
    order_id = f"JH_ORD_{int(datetime.now(timezone.utc).timestamp())}_{uuid.uuid4().hex[:6].upper()}"

    tx = PaymentTransaction(
        order_id=order_id,
        user_id=current_user.id,
        course_id=data.course_id,
        amount=data.amount,
        payment_method=data.payment_method,
        status="PENDING",
        upi_ref=f"upi_ref_{uuid.uuid4().hex[:8]}"
    )
    db.add(tx)
    db.commit()
    db.refresh(tx)

    return {
        "order_id": order_id,
        "amount": data.amount,
        "currency": "INR",
        "course_title": course.title if course else "Course Enrollment",
        "supported_upi_apps": ["Google Pay", "PhonePe", "Paytm", "BHIM"],
        "status": "PENDING"
    }

@router.post("/verify")
def verify_payment(
    data: VerifyPaymentRequest,
    current_user: User = Depends(get_current_authenticated_user),
    db: Session = Depends(get_db)
):
    tx = db.query(PaymentTransaction).filter(PaymentTransaction.order_id == data.order_id).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Payment order not found")

    # Mark transaction verified
    tx.status = "SUCCESS"
    tx.upi_ref = data.upi_ref or f"UPI-TN-{uuid.uuid4().hex[:8].upper()}"
    tx.receipt_url = f"/api/v1/payments/receipt/{tx.order_id}"

    # Auto-enroll in course if applicable
    if tx.course_id:
        existing = (
            db.query(CourseEnrollment)
            .filter(CourseEnrollment.course_id == tx.course_id, CourseEnrollment.user_id == current_user.id)
            .first()
        )
        if not existing:
            enrollment = CourseEnrollment(
                course_id=tx.course_id,
                user_id=current_user.id,
                payment_id=tx.order_id,
                amount_paid=tx.amount,
                payment_status="SUCCESS"
            )
            db.add(enrollment)

    db.commit()
    db.refresh(tx)

    return {
        "success": True,
        "order_id": tx.order_id,
        "payment_status": "SUCCESS",
        "upi_reference": tx.upi_ref,
        "receipt_url": tx.receipt_url
    }

@router.get("/receipt/{order_id}")
def get_payment_receipt(order_id: str, db: Session = Depends(get_db)):
    tx = db.query(PaymentTransaction).filter(PaymentTransaction.order_id == order_id).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction receipt not found")

    return {
        "receipt_id": f"REC-{tx.order_id}",
        "order_id": tx.order_id,
        "amount": f"₹{tx.amount}",
        "currency": tx.currency,
        "payment_method": tx.payment_method,
        "upi_reference": tx.upi_ref,
        "status": tx.status,
        "date": tx.created_at.isoformat()
    }
