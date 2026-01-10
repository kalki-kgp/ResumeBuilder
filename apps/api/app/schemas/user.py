from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


# Request schemas
class UserSignup(BaseModel):
    """Schema for user signup request"""

    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)


class UserLogin(BaseModel):
    """Schema for user login request"""

    email: EmailStr
    password: str
    remember_me: bool = False


# Response schemas
class Token(BaseModel):
    """Schema for token response"""

    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    """Schema for user data response"""

    id: int
    email: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True  # Pydantic v2 (replaces orm_mode)
