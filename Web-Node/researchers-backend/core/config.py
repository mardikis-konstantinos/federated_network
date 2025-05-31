import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    KEYCLOAK_SERVER: str = os.getenv("KEYCLOAK_SERVER")
    REALM: str = os.getenv("REALM")
    CLIENT_ID: str = os.getenv("CLIENT_ID")
    CLIENT_SECRET: str = os.getenv("CLIENT_SECRET")

    def __init__(self):
        if not (self.CLIENT_ID and self.CLIENT_SECRET):
            raise RuntimeError("CLIENT_ID and CLIENT_SECRET erro")
