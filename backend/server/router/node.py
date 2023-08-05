from fastapi import APIRouter, Request

from db.node_db import get_nodes as db_get_nodes
from db.node_db import search_node as db_search_node

router = APIRouter()


@router.get("/nodes/connect/{nodeId}")
async def get_nodes(nodeId):
    nodes = db_get_nodes(nodeId)
    return nodes


@router.get("/node/search/")
async def get_node(request: Request):
    node_query = request.query_params.get("query")
    nodes = db_search_node(node_query)

    return nodes
