from fastapi import status
from fastapi.responses import JSONResponse

ESCROW_INIT_FAILED = "ESCROW_INIT_FAILED"
VALIDATION_FAILED = "VALIDATION_FAILED"
AUTH_FAILED = "AUTH_FAILED"
NOT_FOUND = "NOT_FOUND"


def error_response(error: str, message: str, *, detail: str | None = None, http_status: int = status.HTTP_400_BAD_REQUEST) -> JSONResponse:
	payload = {"error": error, "message": message}
	if detail is not None:
		payload["detail"] = detail
	return JSONResponse(status_code=http_status, content=payload)
