from datetime import datetime, timedelta, timezone
from typing import Any

from jose import JWTError, jwt
from app.config import settings
import bcrypt

def hash_password(password: str) -> str:
	salt = bcrypt.gensalt()
	return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def verify_password(plain_password: str, password_hash: str) -> bool:
	try:
		return bcrypt.checkpw(plain_password.encode("utf-8"), password_hash.encode("utf-8"))
	except Exception:
		return False


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
