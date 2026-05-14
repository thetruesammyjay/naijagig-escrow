from app.config import settings

TESTNET_HORIZON_URL = "https://horizon-testnet.stellar.org"
MAINNET_HORIZON_URL = "https://horizon.stellar.org"
TESTNET_NETWORK_PASSPHRASE = "Test SDF Network ; September 2015"
PUBLIC_NETWORK_PASSPHRASE = "Public Global Stellar Network ; September 2015"


def is_testnet() -> bool:
	return settings.stellar_network.lower() == "testnet"


def get_horizon_url() -> str:
	return TESTNET_HORIZON_URL if is_testnet() else MAINNET_HORIZON_URL


def get_network_passphrase() -> str:
	return TESTNET_NETWORK_PASSPHRASE if is_testnet() else PUBLIC_NETWORK_PASSPHRASE
