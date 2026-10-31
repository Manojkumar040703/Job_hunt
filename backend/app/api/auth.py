from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.models.entities import User, CandidateProfile
from app.schemas.schemas import UserLogin, CandidateRegister, Token, UserResponse
from app.api.deps import get_current_authenticated_user, log_audit_event

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=Token)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    email = login_data.email.strip().lower()
    user = db.query(User).filter(User.email == email).first()

    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been deactivated. Please contact administrator Manojkumar."
        )

    access_token = create_access_token(subject=user.id)
    log_audit_event(
        db=db,
        actor_email=user.email,
        action="USER_LOGIN",
        resource="auth",
        details={"role": user.role, "name": user.name},
        user_id=user.id
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register_candidate(data: CandidateRegister, db: Session = Depends(get_db)):
    email = data.email.strip().lower()
    
    # Check existing
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists"
        )

    # Strictly enforce that public registration ONLY creates Candidate role!
    new_user = User(
        email=email,
        hashed_password=get_password_hash(data.password),
        name=data.name.strip(),
        role="candidate", # Strict security rule
        district=data.district or "Chennai",
        phone=data.phone,
        title="Job Seeker",
        is_active=True
    )
    db.add(new_user)
    db.flush()

    # Create empty candidate profile
    profile = CandidateProfile(
        user_id=new_user.id,
        skills=["Communication", "Problem Solving"],
        preferred_districts=[data.district or "Chennai"],
        preferred_roles=["Software Engineer", "Operations"]
    )
    db.add(profile)
    db.commit()
    db.refresh(new_user)

    log_audit_event(
        db=db,
        actor_email=new_user.email,
        action="CANDIDATE_REGISTERED",
        resource="users",
        details={"district": new_user.district},
        user_id=new_user.id
    )

    access_token = create_access_token(subject=new_user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": new_user
    }

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_authenticated_user)):
    return current_user
