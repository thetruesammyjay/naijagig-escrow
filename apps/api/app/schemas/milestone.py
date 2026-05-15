from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


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
	model_config = ConfigDict(from_attributes=True, populate_by_name=True)

	id: str
	job_id: str = Field(alias="jobId")
	status: str
	submission_note: str | None = Field(default=None, alias="submissionNote")
	submitted_at: str | None = Field(default=None, alias="submittedAt")
	approved_at: str | None = Field(default=None, alias="approvedAt")
	disputed_at: str | None = Field(default=None, alias="disputedAt")
	resolved_at: str | None = Field(default=None, alias="resolvedAt")
	created_at: datetime = Field(alias="createdAt")
