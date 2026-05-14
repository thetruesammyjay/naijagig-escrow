from decimal import Decimal

from sqlalchemy import ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin


class Job(Base, TimestampMixin):
	__tablename__ = "jobs"

	id: Mapped[str] = mapped_column(String(36), primary_key=True)
	client_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False)
	freelancer_id: Mapped[str | None] = mapped_column(ForeignKey("users.id"), nullable=True)
	title: Mapped[str] = mapped_column(String, nullable=False)
	description: Mapped[str] = mapped_column(String, nullable=False)
	total_amount: Mapped[Decimal] = mapped_column(Numeric(18, 7), nullable=False)
	status: Mapped[str] = mapped_column(String, nullable=False, default="DRAFT")
	escrow_id: Mapped[str | None] = mapped_column(String, nullable=True)
	contract_address: Mapped[str | None] = mapped_column(String, nullable=True)

	client = relationship("User", foreign_keys=[client_id], back_populates="client_jobs")
	freelancer = relationship("User", foreign_keys=[freelancer_id], back_populates="freelancer_jobs")
	milestones = relationship("Milestone", cascade="all, delete-orphan", back_populates="job", order_by="Milestone.sequence")
	escrow_events = relationship("EscrowEvent", cascade="all, delete-orphan", back_populates="job")
