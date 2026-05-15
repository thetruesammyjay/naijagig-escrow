from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
	model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

	database_url: str = Field(alias="DATABASE_URL")
	redis_url: str = Field(alias="REDIS_URL")
	trustless_work_api_key: str = Field(alias="TRUSTLESS_WORK_API_KEY")
	stellar_network: str = Field(default="testnet", alias="STELLAR_NETWORK")
	jwt_secret: str = Field(alias="JWT_SECRET")
	jwt_algorithm: str = Field(default="HS256", alias="JWT_ALGORITHM")
	access_token_expire_minutes: int = Field(default=10080, alias="ACCESS_TOKEN_EXPIRE_MINUTES")
	refresh_token_expire_days: int = Field(default=7, alias="REFRESH_TOKEN_EXPIRE_DAYS")
	frontend_origin: str = Field(default="http://localhost:3000", alias="FRONTEND_ORIGIN")
	api_v1_prefix: str = "/api/v1"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
	return Settings()


settings = get_settings()
