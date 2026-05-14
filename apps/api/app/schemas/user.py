from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class UserBase(BaseModel):
	email: EmailStr
	full_name: str
	role: str


class UserCreate(UserBase):
	password: str


class UserUpdate(BaseModel):
	full_name: str | None = None
	stellar_address: str | None = None


class UserRead(UserBase):
	model_config = ConfigDict(from_attributes=True)

	id: str
	stellar_address: str | None
	created_at: datetime
	updated_at: datetime
