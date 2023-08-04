from db.node_db import get_nodes as db_get_nodes
from fastapi import APIRouter, Query

router = APIRouter()


@router.get("/nodes/connect/{nodeId}")
async def get_nodes(nodeId):
    nodes = db_get_nodes(nodeId)
    return nodes
