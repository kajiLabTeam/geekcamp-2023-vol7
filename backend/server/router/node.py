from fastapi import APIRouter, Query

from db.node_db import get_nodes as db_get_nodes

router = APIRouter()


@router.get("/nodes/connect/{nodeId}")
async def get_nodes(nodeId):
    nodes = db_get_nodes(nodeId)
    return nodes
