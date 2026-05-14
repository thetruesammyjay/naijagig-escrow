from fastapi import APIRouter

router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.get("")
async def list_jobs() -> dict[str, list]:
	return {"items": []}


@router.post("")
async def create_job() -> dict[str, str]:
	return {"message": "jobs create scaffold"}


@router.get("/{job_id}")
async def read_job(job_id: str) -> dict[str, str]:
	return {"job_id": job_id, "message": "jobs detail scaffold"}
