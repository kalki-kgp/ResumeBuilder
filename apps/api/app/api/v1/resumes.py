from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.resume import (
    DashboardStats,
    ResumeCreate,
    ResumeListResponse,
    ResumeResponse,
    ResumeUpdate,
)
from app.services.resume_service import ResumeService

router = APIRouter()


@router.get("", response_model=ResumeListResponse)
async def list_resumes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all resumes for the current user"""
    service = ResumeService(db)
    resumes = service.get_user_resumes(current_user.id)
    return ResumeListResponse(resumes=resumes, total=len(resumes))


@router.get("/stats", response_model=DashboardStats)
async def get_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get dashboard statistics for the current user"""
    service = ResumeService(db)
    return service.get_dashboard_stats(current_user.id)


@router.post("", response_model=ResumeResponse, status_code=status.HTTP_201_CREATED)
async def create_resume(
    resume_data: ResumeCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new resume"""
    service = ResumeService(db)
    resume = service.create_resume(current_user.id, resume_data)
    return resume


@router.get("/{resume_id}", response_model=ResumeResponse)
async def get_resume(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get a specific resume by ID"""
    service = ResumeService(db)
    resume = service.get_resume_by_id(resume_id, current_user.id)
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found",
        )
    return resume


@router.patch("/{resume_id}", response_model=ResumeResponse)
async def update_resume(
    resume_id: int,
    update_data: ResumeUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update resume metadata"""
    service = ResumeService(db)
    resume = service.update_resume(resume_id, current_user.id, update_data)
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found",
        )
    return resume


@router.delete("/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_resume(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a resume"""
    service = ResumeService(db)
    deleted = service.delete_resume(resume_id, current_user.id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found",
        )


@router.post("/{resume_id}/upload", response_model=ResumeResponse)
async def upload_resume_file(
    resume_id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Upload a file for a resume"""
    service = ResumeService(db)
    resume = service.get_resume_by_id(resume_id, current_user.id)
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found",
        )

    # Validate file type
    if file.content_type not in service.ALLOWED_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type. Allowed: {list(service.ALLOWED_TYPES.values())}",
        )

    # Read file content
    content = await file.read()

    # Check file size (max 10MB)
    max_size = 10 * 1024 * 1024
    if len(content) > max_size:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File too large. Maximum size is 10MB",
        )

    try:
        resume = service.upload_file(
            resume, content, file.filename or "resume", file.content_type or ""
        )
        return resume
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.get("/{resume_id}/download")
async def download_resume_file(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Download the file for a resume"""
    service = ResumeService(db)
    resume = service.get_resume_by_id(resume_id, current_user.id)
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found",
        )

    if not resume.file_path:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No file uploaded for this resume",
        )

    return FileResponse(
        path=resume.file_path,
        filename=f"{resume.title}.{resume.file_type}",
        media_type=f"application/{resume.file_type}"
        if resume.file_type == "pdf"
        else f"image/{resume.file_type}",
    )


@router.get("/{resume_id}/ats")
async def get_ats_analysis(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get detailed ATS analysis for a resume"""
    service = ResumeService(db)
    resume = service.get_resume_by_id(resume_id, current_user.id)
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found",
        )

    return service.get_ats_analysis(resume)


@router.post("/{resume_id}/ats/reanalyze", response_model=ResumeResponse)
async def reanalyze_ats(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Force re-analyze ATS score for a resume"""
    service = ResumeService(db)
    resume = service.get_resume_by_id(resume_id, current_user.id)
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found",
        )

    if not resume.file_path:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No file uploaded for this resume",
        )

    return service.reanalyze_ats(resume)


@router.get("/{resume_id}/suggestions")
async def get_ai_suggestions(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get AI-powered suggestions for improving a resume"""
    service = ResumeService(db)
    resume = service.get_resume_by_id(resume_id, current_user.id)
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found",
        )

    return service.get_ai_suggestions(resume)


@router.get("/{resume_id}/extracted")
async def get_extracted_data(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get extracted structured data from a resume"""
    service = ResumeService(db)
    resume = service.get_resume_by_id(resume_id, current_user.id)
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found",
        )

    return service.get_extracted_data(resume)


@router.post("/{resume_id}/extracted/reextract")
async def reextract_data(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Force re-extract data from a resume"""
    service = ResumeService(db)
    resume = service.get_resume_by_id(resume_id, current_user.id)
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found",
        )

    if not resume.file_path:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No file uploaded for this resume",
        )

    return service.reextract_data(resume)


@router.post("/{resume_id}/fill-template")
async def fill_template(
    resume_id: int,
    template_schema: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Fill a template with extracted resume data"""
    service = ResumeService(db)
    resume = service.get_resume_by_id(resume_id, current_user.id)
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found",
        )

    result = service.fill_template(resume, template_schema)
    if result.get("error"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result["error"],
        )

    return result
