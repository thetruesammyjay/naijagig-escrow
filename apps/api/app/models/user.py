from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin


class User(Base, TimestampMixin):
	__tablename__ = "users"

	id: Mapped[str] = mapped_column(String(36), primary_key=True)
	email: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
	password_hash: Mapped[str] = mapped_column(String, nullable=False)
	full_name: Mapped[str] = mapped_column(String, nullable=False)
	role: Mapped[str] = mapped_column(String, nullable=False)
	stellar_address: Mapped[str | None] = mapped_column(String, nullable=True)

	client_jobs = relationship("Job", foreign_keys="Job.client_id", back_populates="client")
	freelancer_jobs = relationship("Job", foreign_keys="Job.freelancer_id", back_populates="freelancer")
