from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.schemas.milestone import MilestoneCreate, MilestoneRead


class JobBase(BaseModel):
	title: str
	description: str
	total_amount: Decimal


class JobCreate(JobBase):
	client_id: str
	freelancer_id: str | None = None
	milestones: list[MilestoneCreate] = Field(default_factory=list)

	@model_validator(mode="after")
	def validate_milestone_amounts(self) -> "JobCreate":
		total = sum((milestone.amount for milestone in self.milestones), Decimal("0"))
		if total != self.total_amount:
			raise ValueError("Milestone amounts must equal total_amount")
		return self


class JobUpdate(BaseModel):
	title: str | None = None
	description: str | None = None
	freelancer_id: str | None = None


class JobRead(JobBase):
	model_config = ConfigDict(from_attributes=True)

	id: str
	client_id: str
	freelancer_id: str | None
	status: str
	escrow_id: str | None
	contract_address: str | None
	milestones: list[MilestoneRead] = Field(default_factory=list)
	created_at: datetime
	updated_at: datetime
