from dataclasses import dataclass

import httpx

from app.config import settings

TESTNET_BASE_URL = "https://dev.api.trustlesswork.com"
MAINNET_BASE_URL = "https://api.trustlesswork.com"


def get_base_url() -> str:
	return TESTNET_BASE_URL if settings.stellar_network.lower() == "testnet" else MAINNET_BASE_URL


@dataclass(slots=True)
class TrustlessWorkClient:
	async def _request(self, method: str, path: str, *, json: dict | None = None) -> dict:
		headers = {"Authorization": f"Bearer {settings.trustless_work_api_key}"}
		async with httpx.AsyncClient(base_url=get_base_url(), headers=headers, timeout=30.0) as client:
			response = await client.request(method, path, json=json)
			response.raise_for_status()
			return response.json()

	async def initialize_escrow(self, payload: dict) -> dict:
		return await self._request("POST", "/escrow", json=payload)

	async def fund_escrow(self, escrow_id: str) -> dict:
		return await self._request("POST", f"/escrow/{escrow_id}/fund")

	async def submit_milestone(self, escrow_id: str, sequence: int, note: str) -> dict:
		return await self._request("POST", f"/escrow/{escrow_id}/milestone/{sequence}/submit", json={"note": note})

	async def approve_milestone(self, escrow_id: str, sequence: int) -> dict:
		return await self._request("POST", f"/escrow/{escrow_id}/milestone/{sequence}/approve")

	async def dispute_milestone(self, escrow_id: str, sequence: int, reason: str) -> dict:
		return await self._request("POST", f"/escrow/{escrow_id}/milestone/{sequence}/dispute", json={"reason": reason})

	async def get_escrow(self, escrow_id: str) -> dict:
		return await self._request("GET", f"/escrow/{escrow_id}")


trustless_work_client = TrustlessWorkClient()
