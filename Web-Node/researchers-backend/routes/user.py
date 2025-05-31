from typing import Optional
from fastapi import APIRouter, HTTPException
from schemas.user import UserCreate, UserUpdate
from services.user_service import update_user, delete_user, get_users_by_role
from services.event_service import get_user_event_logs
from services.user_service import create_user
from fastapi import Query
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

USER_ROLE_ID: str = os.getenv("USER_ROLE_ID")


@router.post("/create")
def create_new_user(
    user: UserCreate,
):
    payload = user.dict()
    user_role = [{"id": USER_ROLE_ID, "name": "user"}]
    user_id = create_user(payload, user_role)
    return {"message": "user created", "id": user_id}


@router.put("/{user_id}")
def update_existing_user(user_id: str, user: UserUpdate):
    data = user.dict(exclude_unset=True)
    if not data:
        raise HTTPException(400, "No fields provided")
    update_user(user_id, data)
    return {"message": "User updated", "id": user_id}


@router.delete("/{user_id}")
def delete_existing_user(user_id: str):
    delete_user(user_id)
    return {"message": "User deleted"}


@router.get("/by-role/{role_name}", summary="List users by realm role")
def list_users_by_role(
    role_name: str, max: int = Query(100, description="max number of users to return")
):

    users = get_users_by_role(role_name)

    return {"count": len(users[:max]), "users": users[:max]}


@router.get("/{user_id}/events", summary="List events for a given user")
def list_events_for_user(
    user_id: str,
    max: int = Query(100, gt=0, le=1000, description="max number of events to return"),
    since: Optional[int] = Query(
        None, description="Only events after this timestamp (in ms since epoch)"
    ),
):

    events = get_user_event_logs(user_id=user_id, max_results=max, since=since)
    return {"count": len(events), "events": events}
