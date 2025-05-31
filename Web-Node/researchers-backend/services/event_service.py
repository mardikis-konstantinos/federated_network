from typing import List, Optional
import requests
from fastapi import HTTPException
from core.keycloak import get_admin_token, settings

ADMIN_BASE = f"{settings.KEYCLOAK_SERVER}/admin/realms/{settings.REALM}"


def get_user_event_logs(
    user_id: str, max_results: int = 100, since: Optional[int] = None
) -> List[dict]:

    token = get_admin_token()
    headers = {"Authorization": f"Bearer {token}"}

    params = {"max": max_results, "user": user_id}
    if since is not None:
        params["time"] = since

    resp = requests.get(f"{ADMIN_BASE}/events", headers=headers, params=params)
    if resp.status_code != 200:
        raise HTTPException(
            resp.status_code, f"Error fetching user events: {resp.text}"
        )
    return resp.json()
