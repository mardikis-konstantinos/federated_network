import uuid
from datetime import datetime
from typing import List, Dict, Any
import os
from dotenv import load_dotenv
from pymongo import MongoClient
import pandas as pd
from services.user_service import create_user

load_dotenv()


MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB = os.getenv("MONGO_DB")
PATIENT_ROLE_ID = os.getenv("PATIENT_ROLE_ID")
PSEUDO_COLL = os.getenv("PSEUDO_COLL")
META_COLL = os.getenv("META_COLL")
CONSENT_COLL = os.getenv("CONSENT_COLL")
GLOBAL_META_ID = os.getenv("GLOBAL_META_ID")

mongo_client = MongoClient(MONGO_URI)
db = mongo_client[MONGO_DB]


pseudo_coll = db[PSEUDO_COLL]
meta_coll = db[META_COLL]
consent_coll = db[CONSENT_COLL]


def pseudonymize(records: List[Dict[str, Any]], upload_id: str) -> List[Dict[str, Any]]:

    pseudo_records = []
    for rec in records:
        new_rec = rec.copy()

        original_id = new_rec.get("Patient_ID")
        new_rec["original_id"] = original_id

        new_rec.pop("Patient_ID", None)
        new_rec.pop("email", None)

        new_rec["pseudonym_id"] = str(uuid.uuid4())
        new_rec["upload_id"] = upload_id
        pseudo_records.append(new_rec)
    return pseudo_records


def _recalc_global_metadata():

    timestamp = datetime.utcnow()

    consent_yes_ids = [doc["_id"] for doc in consent_coll.find({"consent": "yes"})]

    cursor = pseudo_coll.find()
    filtered_records = []
    for d in cursor:
        for rec in d.get("pseudonymized_records", []):
            if rec.get("upload_id") in consent_yes_ids:
                filtered_records.append(rec)

    if not filtered_records:
        meta = {
            "_id": GLOBAL_META_ID,
            "record_count": 0,
            "fields": [],
            "stats": {},
            "metadata_updated_at": timestamp,
        }
    else:
        df = pd.DataFrame(filtered_records)
        meta = {"_id": GLOBAL_META_ID}
        meta["record_count"] = len(filtered_records)
        meta["fields"] = list(df.columns)
        stats: Dict[str, Any] = {}
        for col in df.columns:
            series = df[col]
            if pd.api.types.is_numeric_dtype(series):
                stats[col] = {
                    "min": float(series.min()),
                    "max": float(series.max()),
                    "mean": float(series.mean()),
                }
            else:
                stats[col] = (
                    (series.value_counts(normalize=True) * 100).round(2).to_dict()
                )
        meta["stats"] = stats
        meta["metadata_updated_at"] = timestamp

    meta_coll.replace_one({"_id": GLOBAL_META_ID}, meta, upsert=True)


def process_upload(
    patient_info: Dict[str, str], excel_records: List[Dict[str, Any]], doctor_id: str
) -> Dict[str, str]:

    user_payload = {
        "username": patient_info["email"],
        "email": patient_info["email"],
        "firstName": patient_info["firstName"],
        "lastName": patient_info["lastName"],
        "enabled": True,
        "requiredActions": [],
    }
    patient_role = [{"id": PATIENT_ROLE_ID, "name": "patient"}]
    patient_id = create_user(user_payload, patient_role)

    upload_id = str(uuid.uuid4())
    timestamp = datetime.utcnow()

    new_pseudos = pseudonymize(excel_records, upload_id)

    pseudo_coll.update_one(
        {"_id": doctor_id},
        {
            "$push": {"pseudonymized_records": {"$each": new_pseudos}},
            "$set": {"pseudonymized_at": timestamp},
        },
        upsert=True,
    )

    consent_doc = {
        "_id": upload_id,
        "patient_id": patient_id,
        "doctor_id": doctor_id,
        "consent": patient_info.get("consent", "yes"),
        "timestamp": timestamp,
    }
    consent_coll.replace_one({"_id": upload_id}, consent_doc, upsert=True)

    if consent_doc["consent"].lower() == "yes":
        _recalc_global_metadata()

    return {"doctor_id": doctor_id, "patient_id": patient_id, "upload_id": upload_id}
