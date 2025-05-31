from fastapi import APIRouter
from schemas.user import UserCreate
from services.user_service import create_user
import os
from dotenv import load_dotenv

load_dotenv()
router = APIRouter()

USER_ROLE_ID: str = os.getenv("USER_ROLE_ID")


@router.post("/doctor")
def create_doctor(user: UserCreate):
    payload = user.dict()
    doctor_role = [{"id": USER_ROLE_ID, "name": "user"}]
    user_id = create_user(payload, doctor_role)
    return {"message": "Doctor created", "id": user_id}
