from fastapi import APIRouter

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me")
async def read_current_user() -> dict[str, str | None]:
	return {"message": "users me scaffold", "stellar_address": None}


@router.patch("/me")
async def update_current_user() -> dict[str, str]:
	return {"message": "users me update scaffold"}
