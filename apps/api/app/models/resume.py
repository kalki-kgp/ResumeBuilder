from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.core.database import Base


class Resume(Base):
    """Resume database model"""

    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=True)  # Path to uploaded file
    file_type = Column(String(10), nullable=True)  # pdf, png, etc.
    file_size = Column(Integer, nullable=True)  # Size in bytes
    extracted_data_path = Column(String(500), nullable=True)  # Path to extracted JSON
    ats_score = Column(Integer, default=0)  # ATS score 0-100
    thumbnail_color = Column(String(50), default="bg-blue-900/20")  # Tailwind class
    content = Column(Text, nullable=True)  # ATS analysis JSON (legacy)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    # Relationship to user
    user = relationship("User", back_populates="resumes")
