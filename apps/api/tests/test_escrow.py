from app.services.stellar import get_horizon_url


def test_stellar_horizon_defaults_to_testnet() -> None:
	assert get_horizon_url() == "https://horizon-testnet.stellar.org"
