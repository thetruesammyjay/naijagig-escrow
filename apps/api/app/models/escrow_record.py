from sqlalchemy import ForeignKey, JSON, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin


class EscrowEvent(Base, TimestampMixin):
	__tablename__ = "escrow_events"

	id: Mapped[str] = mapped_column(String(36), primary_key=True)
	job_id: Mapped[str] = mapped_column(ForeignKey("jobs.id"), nullable=False)
	milestone_id: Mapped[str | None] = mapped_column(ForeignKey("milestones.id"), nullable=True)
	event_type: Mapped[str] = mapped_column(String, nullable=False)
	stellar_tx_hash: Mapped[str | None] = mapped_column(String, nullable=True)
	payload: Mapped[dict | None] = mapped_column(JSON, nullable=True)

	job = relationship("Job", back_populates="escrow_events")
	milestone = relationship("Milestone", back_populates="escrow_events")
