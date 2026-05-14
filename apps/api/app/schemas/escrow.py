from datetime import datetime

from pydantic import BaseModel, ConfigDict


class EscrowEventRead(BaseModel):
	model_config = ConfigDict(from_attributes=True)

	id: str
	job_id: str
	milestone_id: str | None
	event_type: str
	stellar_tx_hash: str | None
	payload: dict | None
	created_at: datetime


class EscrowStatusRead(BaseModel):
	escrow_id: str
	contract_address: str
	job_status: str
	on_chain_status: str | None = None
	last_synced_at: datetime | None = None
