from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


# Request schemas
class ResumeCreate(BaseModel):
    """Schema for creating a resume (without file)"""

    title: str = Field(..., min_length=1, max_length=255)


class ResumeUpdate(BaseModel):
    """Schema for updating resume metadata"""

    title: Optional[str] = Field(None, min_length=1, max_length=255)
    ats_score: Optional[int] = Field(None, ge=0, le=100)
    thumbnail_color: Optional[str] = None


# Response schemas
class ResumeResponse(BaseModel):
    """Schema for resume data response"""

    id: int
    user_id: int
    title: str
    file_path: Optional[str] = None
    file_type: Optional[str] = None
    file_size: Optional[int] = None
    extracted_data_path: Optional[str] = None
    ats_score: int
    thumbnail_color: str
    created_at: datetime
    updated_at: datetime

    @property
    def has_extracted_data(self) -> bool:
        return self.extracted_data_path is not None

    class Config:
        from_attributes = True


class ResumeListResponse(BaseModel):
    """Schema for list of resumes"""

    resumes: list[ResumeResponse]
    total: int


# Dashboard stats
class DashboardStats(BaseModel):
    """Schema for dashboard statistics"""

    total_resumes: int
    average_ats_score: int
    highest_ats_score: int
    resumes_this_week: int
