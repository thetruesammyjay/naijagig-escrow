from decimal import Decimal

from pydantic import ValidationError

from app.schemas.job import JobCreate


def test_job_create_requires_milestone_sum_to_match_total() -> None:
	try:
		JobCreate(
			title="Website build",
			description="Build landing page and dashboard",
			total_amount=Decimal("100.0000000"),
			client_id="client-1",
			milestones=[
				{"sequence": 1, "title": "Design", "description": "Landing page design", "amount": Decimal("40.0000000")},
				{"sequence": 2, "title": "Build", "description": "Implementation", "amount": Decimal("40.0000000")},
			],
		)
	except ValidationError as exc:
		assert "Milestone amounts must equal total_amount" in str(exc)
	else:
		raise AssertionError("Expected validation error")
