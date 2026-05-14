from fastapi import APIRouter

router = APIRouter(prefix="/milestones", tags=["milestones"])


@router.get("")
async def list_milestones() -> dict[str, list]:
	return {"items": []}
