"""Schemas for extracted resume data and template filling"""

from datetime import date
from typing import Any, Optional

from pydantic import BaseModel, Field


# ============================================================================
# EXTRACTED RESUME DATA (Source data from uploaded resume)
# ============================================================================


class ContactInfo(BaseModel):
    """Contact information extracted from resume"""

    full_name: str = ""
    email: str = ""
    phone: str = ""
    location: str = ""  # City, State/Country
    linkedin: str = ""
    github: str = ""
    portfolio: str = ""
    other_links: list[str] = Field(default_factory=list)


class WorkExperience(BaseModel):
    """Single work experience entry"""

    job_title: str = ""
    company: str = ""
    location: str = ""
    start_date: str = ""  # e.g., "Jan 2020" or "2020-01"
    end_date: str = ""  # e.g., "Present" or "Dec 2023"
    is_current: bool = False
    description: str = ""  # Full description
    bullet_points: list[str] = Field(default_factory=list)  # Key achievements
    technologies: list[str] = Field(default_factory=list)  # Tech used in role


class Education(BaseModel):
    """Single education entry"""

    degree: str = ""  # e.g., "Bachelor of Science in Computer Science"
    institution: str = ""
    location: str = ""
    start_date: str = ""
    end_date: str = ""
    gpa: str = ""
    honors: list[str] = Field(default_factory=list)  # Dean's list, etc.
    relevant_coursework: list[str] = Field(default_factory=list)


class Project(BaseModel):
    """Single project entry"""

    name: str = ""
    description: str = ""
    technologies: list[str] = Field(default_factory=list)
    url: str = ""
    bullet_points: list[str] = Field(default_factory=list)
    start_date: str = ""
    end_date: str = ""


class Certification(BaseModel):
    """Single certification entry"""

    name: str = ""
    issuer: str = ""
    date_obtained: str = ""
    expiry_date: str = ""
    credential_id: str = ""
    url: str = ""


class Language(BaseModel):
    """Language proficiency"""

    language: str = ""
    proficiency: str = ""  # Native, Fluent, Professional, Basic


class ExtractedResumeData(BaseModel):
    """
    Complete structured data extracted from a resume.
    This is the "source of truth" that templates pull from.
    """

    # Meta
    extraction_version: str = "1.0"
    extracted_at: str = ""

    # Core sections
    contact: ContactInfo = Field(default_factory=ContactInfo)
    summary: str = ""  # Professional summary/objective

    # Experience
    work_experience: list[WorkExperience] = Field(default_factory=list)

    # Education
    education: list[Education] = Field(default_factory=list)

    # Skills
    technical_skills: list[str] = Field(default_factory=list)
    soft_skills: list[str] = Field(default_factory=list)
    skills_by_category: dict[str, list[str]] = Field(default_factory=dict)
    # e.g., {"Programming Languages": ["Python", "JS"], "Frameworks": ["React", "FastAPI"]}

    # Additional sections
    projects: list[Project] = Field(default_factory=list)
    certifications: list[Certification] = Field(default_factory=list)
    languages: list[Language] = Field(default_factory=list)
    publications: list[str] = Field(default_factory=list)
    awards: list[str] = Field(default_factory=list)
    volunteer: list[dict[str, Any]] = Field(default_factory=list)
    interests: list[str] = Field(default_factory=list)

    # Raw text for fallback
    raw_text: str = ""


# ============================================================================
# TEMPLATE SCHEMA (Defines what a template needs)
# ============================================================================


class TemplateField(BaseModel):
    """Definition of a single field in a template"""

    key: str  # Field identifier, e.g., "contact.full_name"
    label: str  # Display label, e.g., "Full Name"
    type: str = "text"  # text, textarea, list, date, etc.
    required: bool = False
    max_items: Optional[int] = None  # For list types
    placeholder: str = ""


class TemplateSection(BaseModel):
    """A section in a template (e.g., Experience, Education)"""

    key: str  # Section identifier
    label: str  # Display label
    type: str = "single"  # single, repeatable
    fields: list[TemplateField] = Field(default_factory=list)
    max_items: Optional[int] = None  # For repeatable sections


class TemplateSchema(BaseModel):
    """
    Schema that defines what fields a template needs.
    Each template can have different sections and fields.
    """

    template_id: str
    template_name: str
    version: str = "1.0"
    sections: list[TemplateSection] = Field(default_factory=list)


class FilledTemplateData(BaseModel):
    """
    Data that has been mapped to fill a specific template.
    This is the output of LLM mapping extracted data → template.
    """

    template_id: str
    source_resume_id: int
    filled_at: str
    data: dict[str, Any]  # The actual filled values matching template schema


# ============================================================================
# API Request/Response schemas
# ============================================================================


class ExtractResumeRequest(BaseModel):
    """Request to extract data from a resume"""

    force_reextract: bool = False


class FillTemplateRequest(BaseModel):
    """Request to fill a template with extracted resume data"""

    template_id: str
    customizations: dict[str, Any] = Field(default_factory=dict)
    # Optional overrides/customizations to apply
