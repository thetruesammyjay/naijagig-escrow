import json

from redis.asyncio import Redis

from app.config import settings


class CacheClient:
	def __init__(self) -> None:
		self._client = Redis.from_url(settings.redis_url, decode_responses=True)

	async def get_json(self, key: str) -> dict | list | str | int | float | bool | None:
		raw = await self._client.get(key)
		if raw is None:
			return None
		return json.loads(raw)

	async def set_json(self, key: str, value: object, *, ex: int | None = None) -> None:
		await self._client.set(key, json.dumps(value), ex=ex)

	async def delete(self, key: str) -> None:
		await self._client.delete(key)

	async def close(self) -> None:
		await self._client.aclose()


cache_client = CacheClient()
