from fastapi import APIRouter

router = APIRouter(prefix="/escrow", tags=["escrow"])


@router.post("/{job_id}/fund")
async def fund_escrow(job_id: str) -> dict[str, str]:
	return {"job_id": job_id, "message": "escrow fund scaffold"}


@router.post("/{job_id}/milestone/{sequence}/submit")
async def submit_milestone(job_id: str, sequence: int) -> dict[str, str | int]:
	return {"job_id": job_id, "sequence": sequence, "message": "escrow submit scaffold"}


@router.post("/{job_id}/milestone/{sequence}/approve")
async def approve_milestone(job_id: str, sequence: int) -> dict[str, str | int]:
	return {"job_id": job_id, "sequence": sequence, "message": "escrow approve scaffold"}


@router.post("/{job_id}/milestone/{sequence}/dispute")
async def dispute_milestone(job_id: str, sequence: int) -> dict[str, str | int]:
	return {"job_id": job_id, "sequence": sequence, "message": "escrow dispute scaffold"}


@router.get("/{job_id}/status")
async def get_status(job_id: str) -> dict[str, str]:
	return {"job_id": job_id, "message": "escrow status scaffold"}
