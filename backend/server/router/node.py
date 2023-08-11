from db.node_db import get_node as db_get_node
from db.node_db import search_node as db_search_node
from fastapi import APIRouter, Request
from settings import (EXTRACTED_NODE_LIMIT, RESPONSE_NODE_LIMIT,
                      SEARCH_NODE_LIMIT)

router = APIRouter()


# ノードのIDを元にノードを取得するエンドポイント
@router.get("/nodes/connect/{nodeId}")
async def get_node(nodeId):
    nodes = db_get_node(nodeId, EXTRACTED_NODE_LIMIT, RESPONSE_NODE_LIMIT)
    return nodes


# クエリパラメーターを元にノードを検索するエンドポイント
@router.get("/node/search")
async def search_node(request: Request):
    node_query = request.query_params.get("query")

    # ノードの名前を元にノード検索を行う
    # 検索ワード、検索候補数、ランダムに生成するノードの母数、返すノードの子ノードの上限数
    nodes = db_search_node(
        node_query, SEARCH_NODE_LIMIT, EXTRACTED_NODE_LIMIT, RESPONSE_NODE_LIMIT
    )

    return nodes
