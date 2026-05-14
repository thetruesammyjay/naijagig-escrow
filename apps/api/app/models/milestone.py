from decimal import Decimal

from sqlalchemy import ForeignKey, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin


class Milestone(Base, TimestampMixin):
	__tablename__ = "milestones"

	id: Mapped[str] = mapped_column(String(36), primary_key=True)
	job_id: Mapped[str] = mapped_column(ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
	sequence: Mapped[int] = mapped_column(nullable=False)
	title: Mapped[str] = mapped_column(String, nullable=False)
	description: Mapped[str] = mapped_column(Text, nullable=False)
	amount: Mapped[Decimal] = mapped_column(Numeric(18, 7), nullable=False)
	status: Mapped[str] = mapped_column(String, nullable=False, default="PENDING")
	submission_note: Mapped[str | None] = mapped_column(Text, nullable=True)
	submitted_at: Mapped[str | None] = mapped_column(String, nullable=True)
	approved_at: Mapped[str | None] = mapped_column(String, nullable=True)
	disputed_at: Mapped[str | None] = mapped_column(String, nullable=True)
	resolved_at: Mapped[str | None] = mapped_column(String, nullable=True)

	job = relationship("Job", back_populates="milestones")
	escrow_events = relationship("EscrowEvent", back_populates="milestone")
