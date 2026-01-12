from fastapi import APIRouter

from app.api.v1 import auth, resumes

router = APIRouter()

# Include auth routes
router.include_router(auth.router, prefix="/auth", tags=["auth"])

# Include resume routes
router.include_router(resumes.router, prefix="/resumes", tags=["resumes"])


@router.get("/")
async def root() -> dict[str, str]:
    return {"message": "API v1"}
