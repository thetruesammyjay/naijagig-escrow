from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class MilestoneBase(BaseModel):
	sequence: int
	title: str
	description: str
	amount: Decimal


class MilestoneCreate(MilestoneBase):
	pass


class MilestoneUpdate(BaseModel):
	title: str | None = None
	description: str | None = None
	amount: Decimal | None = None


class MilestoneRead(MilestoneBase):
	model_config = ConfigDict(from_attributes=True)

	id: str
	job_id: str
	status: str
	submission_note: str | None
	submitted_at: str | None
	approved_at: str | None
	disputed_at: str | None
	resolved_at: str | None
	created_at: datetime
