from datetime import timedelta

from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import create_access_token, get_password_hash, verify_password
from app.models.user import User
from app.schemas.user import UserLogin, UserSignup


class UserService:
    """Service layer for user operations"""

    def __init__(self, db: Session):
        self.db = db

    def get_user_by_email(self, email: str) -> User | None:
        """Get user by email address"""
        return self.db.query(User).filter(User.email == email).first()

    def get_user_by_id(self, user_id: int) -> User | None:
        """Get user by ID"""
        return self.db.query(User).filter(User.id == user_id).first()

    def create_user(self, user_data: UserSignup) -> User:
        """
        Create a new user

        Raises:
            ValueError: If email already exists
        """
        # Check if user exists
        existing_user = self.get_user_by_email(user_data.email)
        if existing_user:
            raise ValueError("Email already registered")

        # Create user with hashed password
        hashed_password = get_password_hash(user_data.password)
        db_user = User(
            email=user_data.email,
            hashed_password=hashed_password,
        )

        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def authenticate_user(self, login_data: UserLogin) -> User | None:
        """
        Authenticate user with email and password

        Returns:
            User object if authenticated, None otherwise
        """
        user = self.get_user_by_email(login_data.email)
        if not user:
            return None
        if not verify_password(login_data.password, user.hashed_password):
            return None
        return user

    def create_user_token(self, user: User, remember_me: bool = False) -> str:
        """
        Create access token for user

        Args:
            user: User object
            remember_me: If True, token expires in 30 days; else 30 minutes
        """
        expires_minutes = (
            settings.ACCESS_TOKEN_EXPIRE_MINUTES_REMEMBER
            if remember_me
            else settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )

        access_token = create_access_token(
            data={"sub": str(user.id)}, expires_delta=timedelta(minutes=expires_minutes)
        )
        return access_token
