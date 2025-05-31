from fastapi import APIRouter, HTTPException
from typing import Dict, Any
import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

router = APIRouter(prefix="/metadata", tags=["Metadata"])

MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB = os.getenv("MONGO_DB")
META_COLL = os.getenv("META_COLL")

mongo_client = MongoClient(MONGO_URI)
db = mongo_client[MONGO_DB]
meta_coll = db[META_COLL]


@router.get("/{node_id}")
async def get_global_metadata(node_id: str) -> Dict[str, Any]:
    doc = meta_coll.find_one(
        {"_id": node_id},
        {"stats.original_id": 0, "stats.pseudonym_id": 0, "stats.upload_id": 0},
    )
    if not doc:
        raise HTTPException(404, "Global metadata not found")
    doc["_id"] = str(doc["_id"])
    return doc
