import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models import User  # importing from package ensures all models are registered
from app.schemas.user import UserCreate, LoginRequest, AuthResponse
from app.services.auth import hash_password, verify_password, create_access_token, create_refresh_token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=AuthResponse)
async def register(payload: UserCreate, db: Session = Depends(get_db)):
	if db.query(User).filter(User.email == payload.email).first():
		raise HTTPException(status_code=400, detail="Email already registered")
	
	user = User(
		id=str(uuid.uuid4()),
		email=payload.email,
		full_name=payload.full_name,
		role=payload.role,
		password_hash=hash_password(payload.password)
	)
	db.add(user)
	db.commit()
	db.refresh(user)

	access_token = create_access_token(subject=user.id)
	refresh_token = create_refresh_token(subject=user.id)
	
	return AuthResponse(
		access_token=access_token,
		refresh_token=refresh_token,
		user=user
	)


@router.post("/login", response_model=AuthResponse)
async def login(payload: LoginRequest, db: Session = Depends(get_db)):
	user = db.query(User).filter(User.email == payload.email).first()
	if not user or not verify_password(payload.password, user.password_hash):
		raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
	
	access_token = create_access_token(subject=user.id)
	refresh_token = create_refresh_token(subject=user.id)
	
	return AuthResponse(
		access_token=access_token,
		refresh_token=refresh_token,
		user=user
	)


@router.post("/refresh")
async def refresh() -> dict[str, str]:
	return {"message": "auth refresh scaffold"}


@router.post("/logout")
async def logout() -> dict[str, str]:
	return {"message": "auth logout scaffold"}
