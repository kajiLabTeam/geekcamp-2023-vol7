from db.node_db import get_nodes as db_get_nodes
from fastapi import APIRouter, Query

router = APIRouter()


@router.get("/nodes")
async def get_nodes():
    nodes = db_get_nodes(1)
    return {"nodes": nodes}


@router.get("/search/nodes")
async def get_node(node_ids: list = Query(None)):
    # db からノード情報を取得する
    # nodes = db_get_node()
    # return {"nodes": nodes}
    return {"message": "Hello Nodes"}
