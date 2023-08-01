from fastapi import APIRouter, Query
from db.node_db import get_all_nodes as db_get_all_node
from db.node_db import get_nodes as db_get_node

router = APIRouter()


@router.get("/nodes")
async def get_all_node():
    # db からノード情報を取得する
    # nodes = db_get_all_node()
    # return {"nodes": nodes}
    return {"message": "Hello All Nodes"}


@router.get("/search/nodes")
async def get_node(node_ids: list = Query(None)):
    # db からノード情報を取得する
    # nodes = db_get_node()
    # return {"nodes": nodes}
    return {"message": "Hello Nodes"}
