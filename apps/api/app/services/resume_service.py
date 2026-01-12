import json
import logging
from datetime import datetime, timedelta
from pathlib import Path

from sqlalchemy.orm import Session

from app.models.resume import Resume
from app.schemas.resume import DashboardStats, ResumeCreate, ResumeUpdate
from app.services.ai_service import ai_service

logger = logging.getLogger(__name__)


class ResumeService:
    """Service class for resume operations"""

    UPLOAD_DIR = Path("uploads/resumes")
    EXTRACTED_DIR = Path("uploads/extracted")
    ALLOWED_TYPES = {"application/pdf": "pdf", "image/png": "png", "image/jpeg": "jpg"}

    def __init__(self, db: Session):
        self.db = db
        self.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
        self.EXTRACTED_DIR.mkdir(parents=True, exist_ok=True)

    def get_user_resumes(self, user_id: int) -> list[Resume]:
        """Get all resumes for a user, ordered by most recent"""
        return (
            self.db.query(Resume)
            .filter(Resume.user_id == user_id)
            .order_by(Resume.updated_at.desc())
            .all()
        )

    def get_resume_by_id(self, resume_id: int, user_id: int) -> Resume | None:
        """Get a specific resume by ID for a user"""
        return (
            self.db.query(Resume)
            .filter(Resume.id == resume_id, Resume.user_id == user_id)
            .first()
        )

    def create_resume(self, user_id: int, resume_data: ResumeCreate) -> Resume:
        """Create a new resume metadata entry"""
        # Generate a random thumbnail color
        colors = [
            "bg-blue-900/20",
            "bg-purple-900/20",
            "bg-green-900/20",
            "bg-orange-900/20",
            "bg-pink-900/20",
        ]
        import random

        thumbnail_color = random.choice(colors)

        resume = Resume(
            user_id=user_id,
            title=resume_data.title,
            ats_score=0,
            thumbnail_color=thumbnail_color,
        )
        self.db.add(resume)
        self.db.commit()
        self.db.refresh(resume)
        return resume

    def upload_file(
        self,
        resume: Resume,
        file_content: bytes,
        filename: str,
        content_type: str,
        analyze: bool = True,
    ) -> Resume:
        """Upload a file for a resume and analyze (ATS + data extraction)"""
        if content_type not in self.ALLOWED_TYPES:
            raise ValueError(
                f"Invalid file type. Allowed: {list(self.ALLOWED_TYPES.values())}"
            )

        file_ext = self.ALLOWED_TYPES[content_type]
        safe_filename = f"{resume.user_id}_{resume.id}_{int(datetime.utcnow().timestamp())}.{file_ext}"
        file_path = self.UPLOAD_DIR / safe_filename

        # Save file to disk
        with open(file_path, "wb") as f:
            f.write(file_content)

        # Update resume record
        resume.file_path = str(file_path)
        resume.file_type = file_ext
        resume.file_size = len(file_content)

        if analyze:
            # Extract structured data from resume
            try:
                extracted_data = ai_service.extract_resume_data(str(file_path))
                if not extracted_data.get("error"):
                    # Save extracted data to JSON file
                    extracted_filename = f"{resume.user_id}_{resume.id}_extracted.json"
                    extracted_path = self.EXTRACTED_DIR / extracted_filename
                    with open(extracted_path, "w") as f:
                        json.dump(extracted_data, f, indent=2)
                    resume.extracted_data_path = str(extracted_path)

                    # Update title with extracted name if available
                    if extracted_data.get("contact", {}).get("full_name"):
                        resume.title = extracted_data["contact"]["full_name"]

                    logger.info(f"Data extraction complete for resume {resume.id}")
            except Exception as e:
                logger.error(f"Failed to extract data for resume {resume.id}: {e}")

            # Analyze ATS score
            try:
                ats_result = ai_service.analyze_resume_ats(str(file_path))
                if "score" in ats_result and not ats_result.get("error"):
                    resume.ats_score = ats_result["score"]
                    resume.content = json.dumps(ats_result)
                    logger.info(f"ATS analysis complete for resume {resume.id}: score={resume.ats_score}")
            except Exception as e:
                logger.error(f"Failed to analyze ATS for resume {resume.id}: {e}")

        self.db.commit()
        self.db.refresh(resume)
        return resume

    def get_ats_analysis(self, resume: Resume) -> dict:
        """Get ATS analysis for a resume"""
        if resume.content:
            import json
            try:
                return json.loads(resume.content)
            except json.JSONDecodeError:
                pass

        # If no cached analysis, run fresh analysis
        if resume.file_path:
            return ai_service.analyze_resume_ats(resume.file_path)

        return {
            "score": 0,
            "error": "No file uploaded for this resume",
            "breakdown": {},
            "strengths": [],
            "improvements": [],
            "missing_sections": [],
        }

    def get_ai_suggestions(self, resume: Resume) -> dict:
        """Get AI-powered suggestions for improving a resume"""
        if not resume.file_path:
            return {
                "suggestions": [],
                "overall_impression": "No file uploaded",
                "top_priority": "Upload a resume file first",
            }

        return ai_service.get_resume_suggestions(resume.file_path)

    def reanalyze_ats(self, resume: Resume) -> Resume:
        """Force re-analyze ATS score for a resume"""
        if not resume.file_path:
            return resume

        try:
            ats_result = ai_service.analyze_resume_ats(resume.file_path)
            if "score" in ats_result and not ats_result.get("error"):
                resume.ats_score = ats_result["score"]
                import json
                resume.content = json.dumps(ats_result)
                self.db.commit()
                self.db.refresh(resume)
        except Exception as e:
            logger.error(f"Failed to reanalyze ATS for resume {resume.id}: {e}")

        return resume

    def update_resume(
        self, resume_id: int, user_id: int, update_data: ResumeUpdate
    ) -> Resume | None:
        """Update resume metadata"""
        resume = self.get_resume_by_id(resume_id, user_id)
        if not resume:
            return None

        update_dict = update_data.model_dump(exclude_unset=True)
        for key, value in update_dict.items():
            setattr(resume, key, value)

        self.db.commit()
        self.db.refresh(resume)
        return resume

    def delete_resume(self, resume_id: int, user_id: int) -> bool:
        """Delete a resume and its files"""
        resume = self.get_resume_by_id(resume_id, user_id)
        if not resume:
            return False

        # Delete uploaded file if exists
        if resume.file_path:
            file_path = Path(resume.file_path)
            if file_path.exists():
                file_path.unlink()

        # Delete extracted data JSON if exists
        if resume.extracted_data_path:
            extracted_path = Path(resume.extracted_data_path)
            if extracted_path.exists():
                extracted_path.unlink()

        self.db.delete(resume)
        self.db.commit()
        return True

    def get_extracted_data(self, resume: Resume) -> dict:
        """Get extracted structured data from a resume"""
        if resume.extracted_data_path:
            extracted_path = Path(resume.extracted_data_path)
            if extracted_path.exists():
                with open(extracted_path) as f:
                    return json.load(f)

        # If no cached extraction, extract fresh
        if resume.file_path:
            extracted_data = ai_service.extract_resume_data(resume.file_path)
            if not extracted_data.get("error"):
                # Save for future use
                extracted_filename = f"{resume.user_id}_{resume.id}_extracted.json"
                extracted_path = self.EXTRACTED_DIR / extracted_filename
                with open(extracted_path, "w") as f:
                    json.dump(extracted_data, f, indent=2)
                resume.extracted_data_path = str(extracted_path)
                self.db.commit()
            return extracted_data

        return {
            "error": "No file uploaded for this resume",
            "contact": {},
            "summary": "",
            "work_experience": [],
            "education": [],
            "technical_skills": [],
            "soft_skills": [],
            "skills_by_category": {},
            "projects": [],
            "certifications": [],
            "languages": [],
        }

    def reextract_data(self, resume: Resume) -> dict:
        """Force re-extract data from a resume"""
        if not resume.file_path:
            return {"error": "No file uploaded for this resume"}

        extracted_data = ai_service.extract_resume_data(resume.file_path)
        if not extracted_data.get("error"):
            # Save extracted data
            extracted_filename = f"{resume.user_id}_{resume.id}_extracted.json"
            extracted_path = self.EXTRACTED_DIR / extracted_filename
            with open(extracted_path, "w") as f:
                json.dump(extracted_data, f, indent=2)
            resume.extracted_data_path = str(extracted_path)

            # Update title if name extracted
            if extracted_data.get("contact", {}).get("full_name"):
                resume.title = extracted_data["contact"]["full_name"]

            self.db.commit()
            self.db.refresh(resume)

        return extracted_data

    def fill_template(self, resume: Resume, template_schema: dict) -> dict:
        """Fill a template with extracted resume data"""
        extracted_data = self.get_extracted_data(resume)
        if extracted_data.get("error"):
            return {"error": extracted_data["error"], "data": {}}

        return ai_service.fill_template(extracted_data, template_schema)

    def get_dashboard_stats(self, user_id: int) -> DashboardStats:
        """Get dashboard statistics for a user"""
        resumes = self.get_user_resumes(user_id)

        if not resumes:
            return DashboardStats(
                total_resumes=0,
                average_ats_score=0,
                highest_ats_score=0,
                resumes_this_week=0,
            )

        scores = [r.ats_score for r in resumes]
        one_week_ago = datetime.utcnow() - timedelta(days=7)
        resumes_this_week = sum(1 for r in resumes if r.created_at >= one_week_ago)

        return DashboardStats(
            total_resumes=len(resumes),
            average_ats_score=int(sum(scores) / len(scores)),
            highest_ats_score=max(scores),
            resumes_this_week=resumes_this_week,
        )
