from datetime import datetime, timedelta, timezone
from typing import Any

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
	return pwd_context.hash(password)


def verify_password(plain_password: str, password_hash: str) -> bool:
	return pwd_context.verify(plain_password, password_hash)


def create_access_token(subject: str, expires_delta_minutes: int | None = None, extra_claims: dict[str, Any] | None = None) -> str:
	expires_delta = expires_delta_minutes or settings.access_token_expire_minutes
	expire = datetime.now(timezone.utc) + timedelta(minutes=expires_delta)
	payload: dict[str, Any] = {"sub": subject, "exp": expire}
	if extra_claims:
		payload.update(extra_claims)
	return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def create_refresh_token(subject: str) -> str:
	expire = datetime.now(timezone.utc) + timedelta(days=settings.refresh_token_expire_days)
	return jwt.encode({"sub": subject, "exp": expire, "type": "refresh"}, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def decode_token(token: str) -> dict[str, Any]:
	try:
		return jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
	except JWTError as exc:
		raise ValueError("Invalid token") from exc
