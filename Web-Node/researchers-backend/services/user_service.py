from typing import List
from fastapi import HTTPException
from core.keycloak import get_admin_token, decode_token, settings
import requests

ADMIN_BASE = f"{settings.KEYCLOAK_SERVER}/admin/realms/{settings.REALM}"


def ensure_manage_users():
    token = get_admin_token()
    claims = decode_token(token)
    roles = (
        claims.get("resource_access", {}).get("realm-management", {}).get("roles", [])
    )
    if "manage-users" not in roles:
        raise HTTPException(403, "Service account missing manage-users role")
    return token


def create_user(payload: dict, role_mapping):

    token = ensure_manage_users()
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

    create_payload = {
        "username": payload["username"],
        "email": payload["email"],
        "firstName": payload["firstName"],
        "lastName": payload["lastName"],
        "enabled": payload["enabled"],
        "requiredActions": [
            "VERIFY_PROFILE",
            "UPDATE_PROFILE",
        ],
    }

    resp = requests.post(f"{ADMIN_BASE}/users", json=create_payload, headers=headers)
    if resp.status_code == 409:
        raise HTTPException(409, "User already exists")

    resp.raise_for_status()

    user_id = resp.headers["Location"].rstrip("/").split("/")[-1]

    pwd_payload = {"type": "password", "value": "12345", "temporary": True}
    requests.put(
        f"{ADMIN_BASE}/users/{user_id}/reset-password",
        json=pwd_payload,
        headers=headers,
    ).raise_for_status()

    mapping_resp = requests.post(
        f"{ADMIN_BASE}/users/{user_id}/role-mappings/realm",
        json=role_mapping,
        headers=headers,
    )
    mapping_resp.raise_for_status()

    return user_id


def update_user(user_id: str, update_data: dict):
    token = ensure_manage_users()
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    resp = requests.put(
        f"{ADMIN_BASE}/users/{user_id}", json=update_data, headers=headers
    )
    if resp.status_code == 404:
        raise HTTPException(404, "User not found")
    resp.raise_for_status()
    return


def delete_user(user_id: str):
    token = ensure_manage_users()
    headers = {"Authorization": f"Bearer {token}"}
    resp = requests.delete(f"{ADMIN_BASE}/users/{user_id}", headers=headers)
    if resp.status_code == 404:
        raise HTTPException(404, "User not found")
    resp.raise_for_status()
    return


def get_users_by_role(role_name: str) -> List[dict]:

    token = ensure_manage_users()
    headers = {"Authorization": f"Bearer {token}"}
    resp = requests.get(f"{ADMIN_BASE}/roles/{role_name}/users", headers=headers)
    resp.raise_for_status()
    return resp.json()
