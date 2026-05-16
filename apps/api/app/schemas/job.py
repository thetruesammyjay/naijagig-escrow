from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.schemas.milestone import MilestoneCreate, MilestoneRead


class JobBase(BaseModel):
	title: str
	description: str
	total_amount: Decimal = Field(alias="totalAmount")


class JobCreate(JobBase):
	model_config = ConfigDict(populate_by_name=True)

	freelancer_id: str | None = Field(default=None, alias="freelancerId")
	freelancer_stellar_address: str | None = Field(default=None, alias="freelancerStellarAddress")
	milestones: list[MilestoneCreate] = Field(default_factory=list)

	@model_validator(mode="after")
	def validate_milestone_amounts(self) -> "JobCreate":
		if self.milestones:
			total = sum((milestone.amount for milestone in self.milestones), Decimal("0"))
			if total != self.total_amount:
				raise ValueError("Milestone amounts must equal total_amount")
		return self


class JobUpdate(BaseModel):
	title: str | None = None
	description: str | None = None
	freelancer_id: str | None = Field(default=None, alias="freelancerId")


class JobRead(BaseModel):
	model_config = ConfigDict(from_attributes=True, populate_by_name=True)

	id: str
	client_id: str = Field(alias="clientId")
	freelancer_id: str | None = Field(default=None, alias="freelancerId")
	title: str
	description: str
	total_amount: Decimal = Field(alias="totalAmount")
	status: str
	escrow_id: str | None = Field(default=None, alias="escrowId")
	contract_address: str | None = Field(default=None, alias="contractAddress")
	milestones: list[MilestoneRead] = Field(default_factory=list)
	created_at: datetime = Field(alias="createdAt")
	updated_at: datetime = Field(alias="updatedAt")
