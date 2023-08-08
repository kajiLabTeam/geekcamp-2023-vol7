import random

from db.error.db_error import DBErrorType, db_error
from model.connection import Connection
from model.node import Node


def get_node(node_id: int, extracted_node_limit: int, res_node_limit: int):
    if not node_id:
        return {"message": db_error(DBErrorType.NOT_SELECTED_NODE_ID_ERROR)}

    current_node = Node.get_node_by_id(node_id)
    if current_node is None:
        return {"message": db_error(DBErrorType.NODE_IS_EMPTY_ERROR)}

    connections = Connection.get_connection_by_node_id(
        current_node.id, extracted_node_limit
    )

    relation_nodes = None
    if connections is not None:
        if len(connections) > res_node_limit:
            connections = random.sample(connections, k=res_node_limit)
        relation_nodes = Node.get_node_by_ids(
            [connection.connect_node_id for connection in connections]
        )
        if relation_nodes is None:
            relation_nodes = []

    return {
        "currentNode": {
            "id": current_node.id,
            "name": current_node.node_name,
            "articleId": current_node.article_id,
            "childNodeNum": len(relation_nodes) if relation_nodes is not None else 0,
        },
        "relationNode": [
            {
                "id": relation_node.id,
                "name": relation_node.node_name,
                "articleId": relation_node.article_id,
                "childNodeNum": len(
                    Connection.get_connection_by_node_id(
                        relation_node.id,
                        extracted_node_limit,
                    ) or 0,
                ),
            }
            for relation_node in relation_nodes
        ],
    }


# 記事の名前を元にノードを取得する
def search_node(
    node_query: str, search_limit: int, extracted_node_limit: int, res_node_limit: int
):
    if not node_query:
        return {"message": db_error(DBErrorType.NOT_SELECTED_NODE_NAME_ERROR)}

    current_node = Node.get_node_by_node_name_perfection(node_query)
    if current_node is None:
        return search_node_partial(node_query, search_limit)

    connections = Connection.get_connection_by_node_id(
        current_node.id, extracted_node_limit
    )
    if connections is None:
        return []

    if connections is not None:
        if len(connections) > res_node_limit:
            connections = random.sample(connections, k=res_node_limit)

        relation_nodes = Node.get_node_by_ids(
            [connection.connect_node_id for connection in connections]
        )

    return {
        "type": "node",
        "currentNode": {
            "id": current_node.id,
            "name": current_node.node_name,
            "articleId": current_node.article_id,
            "childNodeNum": len(relation_nodes) if relation_nodes is not None else 0,
        },
        "relationNode": [
            {
                "id": relation_node.id,
                "name": relation_node.node_name,
                "articleId": relation_node.article_id,
                "childNodeNum": len(
                    Connection.get_connection_by_node_id(
                        relation_node.id, extracted_node_limit
                    ) or []
                ),
            }
            for relation_node in relation_nodes
            if relation_nodes is not None
        ],
    }


# 記事の名前を元にノードを取得する (部分一致)
def search_node_partial(node_query: str, search_limit: int):
    suggestions = Node.get_node_by_node_name_partial(node_query, search_limit)
    if suggestions is None:
        return {"type": "suggestion", "suggestions": []}

    return {
        "type": "suggestion",
        "suggestions": [
            {
                "id": suggestion_node.id,
                "name": suggestion_node.node_name,
            }
            for suggestion_node in suggestions
        ],
    }
