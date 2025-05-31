from fastapi import APIRouter
from typing import List, Dict
from services.upload_service import pseudo_coll

router = APIRouter(tags=["Data"])


@router.get("/data")
async def get_all_pseudodata() -> Dict[str, List[Dict]]:

    cursor = pseudo_coll.find({})
    all_records: List[Dict] = []
    for doc in cursor:
        recs = doc.get("pseudonymized_records", [])
        all_records.extend(recs)
    return {"pseudonymized_records": all_records}
