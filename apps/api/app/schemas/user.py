from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserBase(BaseModel):
	email: EmailStr
	full_name: str = Field(alias="fullName")
	role: str


class UserCreate(UserBase):
	password: str


class UserUpdate(BaseModel):
	model_config = ConfigDict(populate_by_name=True)

	full_name: str | None = Field(default=None, alias="fullName")
	stellar_address: str | None = Field(default=None, alias="stellarAddress")


class UserRead(UserBase):
	model_config = ConfigDict(from_attributes=True, populate_by_name=True)

	id: str
	stellar_address: str | None = Field(default=None, alias="stellarAddress")
	created_at: datetime = Field(alias="createdAt")
	updated_at: datetime = Field(alias="updatedAt")


class LoginRequest(BaseModel):
	email: EmailStr
	password: str


class AuthResponse(BaseModel):
	access_token: str = Field(alias="accessToken")
	refresh_token: str = Field(alias="refreshToken")
	user: UserRead
	
	model_config = ConfigDict(populate_by_name=True)
