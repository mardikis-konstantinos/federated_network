from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Dict
from uuid import uuid4
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB = os.getenv("MONGO_DB")
NODES_COLL = os.getenv("NODES_COLL", "nodes")

mongo_client = MongoClient(MONGO_URI)
db = mongo_client[MONGO_DB]
nodes_coll = db[NODES_COLL]

router = APIRouter()


class Node(BaseModel):
    name: str
    node_id: str
    url: str


class NodeUpdate(BaseModel):
    name: str
    url: str


@router.post("/create", response_model=Node, status_code=201)
async def create_node(node: Node):

    if nodes_coll.find_one({"node_id": node.node_id}):
        raise HTTPException(409, "node_id already exists")
    if nodes_coll.find_one({"url": node.url}):
        raise HTTPException(409, "URL already exists")

    doc = node.dict()
    nodes_coll.insert_one(doc)
    return Node(**doc)


@router.get("/get", response_model=List[Node])
async def list_nodes() -> List[Dict]:
    print([Node(**doc) for doc in nodes_coll.find({}, {"_id": 0})])

    return [Node(**doc) for doc in nodes_coll.find({}, {"_id": 0})]


@router.put("/{node_id}", response_model=Node)
async def update_node(node_id: str, payload: NodeUpdate):

    update_data = {
        k: v for k, v in payload.dict(exclude_unset=True).items() if v is not None
    }
    if not update_data:
        raise HTTPException(400, "No fields to update")

    if "url" in update_data:
        if nodes_coll.find_one(
            {"url": update_data["url"], "node_id": {"$ne": node_id}}
        ):
            raise HTTPException(409, "URL already exists")

    result = nodes_coll.update_one({"node_id": node_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(404, "Node not found")

    doc = nodes_coll.find_one({"node_id": node_id}, {"_id": 0, "secret_key": 0})
    return Node(**doc)


@router.delete("/{node_id}", status_code=204)
async def delete_node(node_id: str):

    result = nodes_coll.delete_one({"node_id": node_id})
    if result.deleted_count == 0:
        raise HTTPException(404, "Node not found")
    return
