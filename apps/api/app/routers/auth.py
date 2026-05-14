from fastapi import APIRouter

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login")
async def login() -> dict[str, str]:
	return {"message": "auth login scaffold"}


@router.post("/register")
async def register() -> dict[str, str]:
	return {"message": "auth register scaffold"}


@router.post("/refresh")
async def refresh() -> dict[str, str]:
	return {"message": "auth refresh scaffold"}


@router.post("/logout")
async def logout() -> dict[str, str]:
	return {"message": "auth logout scaffold"}
