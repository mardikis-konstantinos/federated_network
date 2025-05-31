# app/routes/queries.py
"""Single‑node ad‑hoc querying route.
Accepts field / op / value parameters and returns the number of
pseudonymised records that satisfy the comparison.
Expected to be called by the UI (Queries.jsx) as GET <node.url>/node/query
"""
from fastapi import APIRouter, HTTPException, Query
from typing import Dict, Any
import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB = os.getenv("MONGO_DB")
PSEUDO_COLL = os.getenv("PSEUDO_COLL")

mongo_client = MongoClient(MONGO_URI)
db = mongo_client[MONGO_DB]
records_coll = db[PSEUDO_COLL]  # contains docs per doctor with embedded list

router = APIRouter(prefix="/node")

OP_MAP = {
    "gt": "$gt",
    "gte": "$gte",
    "lt": "$lt",
    "lte": "$lte",
    "eq": "$eq",
}


@router.get("/query")
async def query_records(
    field: str = Query(..., description="Name of variable to filter on"),
    op: str = Query("gt", description="Operator: gt|gte|lt|lte|eq"),
    value: str = Query(..., description="Comparison value (number or string)"),
) -> Dict[str, Any]:
    """Return how many embedded pseudonymised records satisfy the comparison."""
    if op not in OP_MAP:
        raise HTTPException(400, "Unsupported operator")

    try:
        comp_val = float(value)
    except ValueError:
        comp_val = value

    mongo_op = OP_MAP[op]

    pipeline = [
        {"$unwind": "$pseudonymized_records"},
        {"$match": {f"pseudonymized_records.{field}": {mongo_op: comp_val}}},
        {"$count": "cnt"},
    ]

    try:
        result = list(records_coll.aggregate(pipeline))
        count = result[0]["cnt"] if result else 0
        return {"count": count}
    except Exception as e:
        raise HTTPException(400, f"Query failed: {e}")
