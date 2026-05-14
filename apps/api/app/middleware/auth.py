from collections.abc import Callable
from typing import Any

from fastapi import HTTPException, Request, status
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

from app.services.auth import decode_token


class JWTMiddleware(BaseHTTPMiddleware):
	async def dispatch(self, request: Request, call_next: Callable[[Request], Any]) -> Response:
		authorization = request.headers.get("Authorization")
		if authorization and authorization.startswith("Bearer "):
			token = authorization.removeprefix("Bearer ").strip()
			try:
				request.state.token_payload = decode_token(token)
			except ValueError as exc:
				raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication token") from exc
		return await call_next(request)
