from fastapi import APIRouter
from schemas.user import UserCreate
from services.user_service import create_user
import os
from dotenv import load_dotenv

load_dotenv()
router = APIRouter()

PATIENT_ROLE_ID: str = os.getenv("PATIENT_ROLE_ID")


@router.post("/patient")
def create_patient(user: UserCreate):
    payload = user.dict()
    patient_role = [{"id": PATIENT_ROLE_ID, "name": "patient"}]
    user_id = create_user(payload, patient_role)
    return {"message": "Patient created", "id": user_id}
