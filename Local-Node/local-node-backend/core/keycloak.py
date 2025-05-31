import requests
from jose import jwt, JWTError
from fastapi import HTTPException
from .config import Settings

settings = Settings()


def get_admin_token() -> str:
    url = f"{settings.KEYCLOAK_SERVER}/realms/{settings.REALM}/protocol/openid-connect/token"
    resp = requests.post(
        url,
        data={
            "grant_type": "client_credentials",
            "client_id": settings.CLIENT_ID,
            "client_secret": settings.CLIENT_SECRET,
        },
    )
    resp.raise_for_status()
    return resp.json()["access_token"]


def decode_token(token: str) -> dict:
    jwks_url = f"{settings.KEYCLOAK_SERVER}/realms/{settings.REALM}/protocol/openid-connect/certs"
    jwks = requests.get(jwks_url).json()
    try:
        return jwt.decode(
            token, jwks, algorithms=["RS256"], audience="realm-management"
        )
    except JWTError as e:
        raise HTTPException(401, f"Token validation error: {e}")
