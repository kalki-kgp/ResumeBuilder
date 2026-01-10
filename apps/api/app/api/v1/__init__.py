from fastapi import APIRouter

from app.api.v1 import auth

router = APIRouter()

# Include auth routes
router.include_router(auth.router, prefix="/auth", tags=["auth"])


@router.get("/")
async def root() -> dict[str, str]:
    return {"message": "API v1"}
