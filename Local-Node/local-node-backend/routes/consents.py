from datetime import datetime
from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict
from services.upload_service import _recalc_global_metadata, consent_coll, pseudo_coll

router = APIRouter(tags=["Consents"])


@router.get("/patients")
async def get_all_consents() -> Dict[str, List[Dict]]:

    cursor = consent_coll.find({})
    consents: List[Dict] = []
    for doc in cursor:

        doc["_id"] = str(doc.get("_id"))
        consents.append(doc)
    return {"consents": consents}


@router.get("/patients/{patient_id}")
async def get_consent(patient_id: str) -> Dict[str, str]:

    doc = consent_coll.find_one({"patient_id": patient_id})
    if not doc:
        raise HTTPException(404, "Consent record not found for this patient_id")
    return {"consent": doc.get("consent", "yes")}


@router.get("/change/{patient_id}")
def change_consent_by_patient(patient_id: str, new_consent: str) -> Dict[str, str]:

    doc = consent_coll.find_one({"patient_id": patient_id})
    if not doc:
        return {"status": "not_found"}
    old = doc.get("consent", "yes").lower()
    new = new_consent.lower()
    if old == new:
        return {"status": "unchanged"}

    upload_id = doc["_id"]

    consent_coll.update_one(
        {"_id": upload_id}, {"$set": {"consent": new, "timestamp": datetime.utcnow()}}
    )

    _recalc_global_metadata()
    return {"status": "updated"}
