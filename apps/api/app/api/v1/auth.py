from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.user import Token, UserLogin, UserResponse, UserSignup
from app.services.user_service import UserService

router = APIRouter()


@router.post("/signup", response_model=Token, status_code=status.HTTP_201_CREATED)
async def signup(
    user_data: UserSignup,
    db: Session = Depends(get_db),
) -> dict[str, str]:
    """
    Create a new user account

    Returns JWT access token
    """
    user_service = UserService(db)

    try:
        # Create user
        user = user_service.create_user(user_data)

        # Generate token
        access_token = user_service.create_user_token(user)

        return {"access_token": access_token, "token_type": "bearer"}

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.post("/login", response_model=Token)
async def login(
    login_data: UserLogin,
    db: Session = Depends(get_db),
) -> dict[str, str]:
    """
    Authenticate user and return JWT access token

    Supports "remember me" for extended token expiry
    """
    user_service = UserService(db)

    # Authenticate user
    user = user_service.authenticate_user(login_data)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Generate token with optional extended expiry
    access_token = user_service.create_user_token(
        user, remember_me=login_data.remember_me
    )

    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Get current authenticated user's information

    Requires valid JWT token in Authorization header
    """
    return current_user
