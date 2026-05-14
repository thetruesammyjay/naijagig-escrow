from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.middleware.cors import configure_cors
from app.routers.auth import router as auth_router
from app.routers.escrow import router as escrow_router
from app.routers.jobs import router as jobs_router
from app.routers.milestones import router as milestones_router
from app.routers.users import router as users_router
from app.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
	yield


app = FastAPI(title="NaijaGig Escrow API", version="0.1.0", lifespan=lifespan)
configure_cors(app)

api_prefix = settings.api_v1_prefix

app.include_router(auth_router, prefix=api_prefix)
app.include_router(jobs_router, prefix=api_prefix)
app.include_router(escrow_router, prefix=api_prefix)
app.include_router(users_router, prefix=api_prefix)
app.include_router(milestones_router, prefix=api_prefix)


@app.get("/health", tags=["system"])
async def health_check() -> dict[str, str]:
	return {"status": "ok", "service": "naijagig-escrow-api"}
