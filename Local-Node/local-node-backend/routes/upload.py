from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import Optional
import pandas as pd
import io
import uuid
from datetime import datetime
from services.upload_service import process_upload
from core.keycloak import get_admin_token

router = APIRouter(tags=["Upload"])


class PatientForm(BaseModel):
    firstName: str
    lastName: str
    email: str
    consent: str


@router.post("/excel")
async def upload_excel(
    firstName: str = Form(...),
    lastName: str = Form(...),
    email: str = Form(...),
    consent: str = Form(...),
    file: UploadFile = File(...),
    doctor_id: str = Form(...),
    _token: str = Depends(get_admin_token),
):

    if not file.filename.lower().endswith((".xlsx", ".xls")):
        raise HTTPException(400, "Invalid file type")
    contents = await file.read()
    try:
        df = pd.read_excel(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(400, f"Error reading Excel: {e}")

    records = df.to_dict(orient="records")

    try:
        result = process_upload(
            patient_info={
                "firstName": firstName,
                "lastName": lastName,
                "email": email,
                "consent": consent,
            },
            excel_records=records,
            doctor_id=doctor_id,
        )
    except Exception as e:
        raise HTTPException(500, f"Upload processing failed: {e}")

    return {"doctor_id": result["doctor_id"], "patientId": result["patient_id"]}
