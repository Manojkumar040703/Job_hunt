import os
import shutil
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.entities import User, CandidateProfile
from app.schemas.schemas import CandidateProfileUpdate, CandidateProfileResponse
from app.api.deps import get_current_authenticated_user
from app.core.config import settings

router = APIRouter(prefix="/candidates", tags=["Candidate Profiles"])

@router.get("/me/profile", response_model=CandidateProfileResponse)
def get_my_profile(
    current_user: User = Depends(get_current_authenticated_user),
    db: Session = Depends(get_db)
):
    profile = db.query(CandidateProfile).filter(CandidateProfile.user_id == current_user.id).first()
    if not profile:
        profile = CandidateProfile(
            user_id=current_user.id,
            skills=[],
            preferred_roles=[],
            preferred_districts=[current_user.district or "Chennai"]
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile

@router.put("/me/profile", response_model=CandidateProfileResponse)
def update_my_profile(
    data: CandidateProfileUpdate,
    current_user: User = Depends(get_current_authenticated_user),
    db: Session = Depends(get_db)
):
    profile = db.query(CandidateProfile).filter(CandidateProfile.user_id == current_user.id).first()
    if not profile:
        profile = CandidateProfile(user_id=current_user.id)
        db.add(profile)

    update_dict = data.dict(exclude_unset=True)
    for k, v in update_dict.items():
        setattr(profile, k, v)

    db.commit()
    db.refresh(profile)
    return profile

@router.post("/me/resume")
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_authenticated_user),
    db: Session = Depends(get_db)
):
    # Validate extension and MIME
    ext = os.path.splitext(file.filename.lower())[1]
    if ext not in [".pdf", ".docx"]:
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are permitted for resumes (up to 5MB)")

    # Read and check size
    contents = await file.read()
    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if len(contents) > max_bytes:
        raise HTTPException(
            status_code=400,
            detail=f"Resume file size exceeds maximum limit of {settings.MAX_UPLOAD_SIZE_MB}MB"
        )

    # Save to upload dir
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    saved_filename = f"resume_{current_user.id}_{uuid.uuid4().hex[:8]}{ext}"
    file_path = os.path.join(settings.UPLOAD_DIR, saved_filename)
    
    with open(file_path, "wb") as f:
        f.write(contents)

    # Update profile
    profile = db.query(CandidateProfile).filter(CandidateProfile.user_id == current_user.id).first()
    if not profile:
        profile = CandidateProfile(user_id=current_user.id)
        db.add(profile)

    profile.resume_url = f"/uploads/{saved_filename}"
    profile.resume_filename = file.filename
    db.commit()
    db.refresh(profile)

    return {
        "message": "Resume uploaded successfully",
        "filename": file.filename,
        "resume_url": profile.resume_url
    }

@router.post("/me/photo")
async def upload_photo(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_authenticated_user),
    db: Session = Depends(get_db)
):
    allowed_exts = [".jpg", ".jpeg", ".png", ".webp"]
    ext = os.path.splitext(file.filename.lower())[1]
    if ext not in allowed_exts:
        raise HTTPException(status_code=400, detail="Photo must be an image (JPG, PNG, WebP)")

    contents = await file.read()
    if len(contents) > 2 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Profile photo must be under 2MB")

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    saved_filename = f"avatar_{current_user.id}_{uuid.uuid4().hex[:8]}{ext}"
    file_path = os.path.join(settings.UPLOAD_DIR, saved_filename)

    with open(file_path, "wb") as f:
        f.write(contents)

    current_user.photo_url = f"/uploads/{saved_filename}"
    db.commit()
    db.refresh(current_user)

    return {
        "message": "Profile photo updated successfully",
        "photo_url": current_user.photo_url
    }
