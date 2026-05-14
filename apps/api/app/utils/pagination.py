from dataclasses import dataclass


@dataclass(slots=True)
class Page:
	items: list
	total: int
	page: int
	size: int


def paginate(items: list, *, page: int = 1, size: int = 20) -> Page:
	start = max(page - 1, 0) * size
	end = start + size
	return Page(items=items[start:end], total=len(items), page=page, size=size)
