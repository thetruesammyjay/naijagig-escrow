import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, selectinload

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models import Job, User
from app.schemas.job import JobCreate, JobRead, JobUpdate

router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.get("", response_model=list[JobRead])
async def list_jobs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return all jobs where the current user is the client or freelancer."""
    jobs = (
        db.query(Job)
        .options(selectinload(Job.milestones))
        .filter(
            (Job.client_id == current_user.id) | (Job.freelancer_id == current_user.id)
        )
        .order_by(Job.created_at.desc())
        .all()
    )
    return jobs


@router.post("", response_model=JobRead, status_code=status.HTTP_201_CREATED)
async def create_job(
    payload: JobCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new job. The client_id is forced to the current authenticated user."""
    from app.models.milestone import Milestone

    # Resolve freelancer — prefer explicit ID, then look up by Stellar address
    resolved_freelancer_id = payload.freelancer_id
    if not resolved_freelancer_id and payload.freelancer_stellar_address:
        freelancer = (
            db.query(User)
            .filter(User.stellar_address == payload.freelancer_stellar_address)
            .first()
        )
        if freelancer:
            resolved_freelancer_id = freelancer.id
        # If no user found, leave as None — client can assign later

    job = Job(
        id=str(uuid.uuid4()),
        client_id=current_user.id,
        freelancer_id=resolved_freelancer_id,
        title=payload.title,
        description=payload.description,
        total_amount=payload.total_amount,
        status="DRAFT",
    )
    db.add(job)
    db.flush()  # get job.id without committing

    for i, ms in enumerate(payload.milestones):
        milestone = Milestone(
            id=str(uuid.uuid4()),
            job_id=job.id,
            title=ms.title,
            description=ms.description,
            amount=ms.amount,
            sequence=i + 1,
            status="PENDING",
        )
        db.add(milestone)

    db.commit()
    db.refresh(job)

    # Re-query with milestones loaded
    job = db.query(Job).options(selectinload(Job.milestones)).filter(Job.id == job.id).first()
    return job


@router.get("/open", response_model=list[JobRead])
async def list_open_jobs(
    db: Session = Depends(get_db),
):
    """Return all open jobs that are funded or draft and have no freelancer assigned yet."""
    jobs = (
        db.query(Job)
        .options(selectinload(Job.milestones))
        .filter(Job.freelancer_id == None, Job.status.in_(["DRAFT", "FUNDED"]))
        .order_by(Job.created_at.desc())
        .all()
    )
    return jobs


@router.get("/{job_id}", response_model=JobRead)
async def read_job(
    job_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Fetch a single job by ID. Only accessible to the client or freelancer."""
    job = (
        db.query(Job)
        .options(selectinload(Job.milestones))
        .filter(Job.id == job_id)
        .first()
    )
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job.client_id != current_user.id and job.freelancer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    return job


@router.patch("/{job_id}", response_model=JobRead)
async def update_job(
    job_id: str,
    payload: JobUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update a job's title, description, or freelancer assignment."""
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the client can update this job")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(job, field, value)

    db.commit()
    db.refresh(job)
    return job
