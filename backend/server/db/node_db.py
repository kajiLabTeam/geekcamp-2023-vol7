import random

from model.connection import Connection
from model.node import Node


def get_nodes(node_id: int, higher_limit: int, res_node_limit: int):
    current_node = Node.get_node_by_id(node_id)
    if current_node is None:
        return []

    connections = Connection.get_connection_by_node_id(current_node.id, higher_limit)
    relation_nodes = None
    if connections is not None:
        connections = random.sample(connections, k=res_node_limit)
        relation_nodes = Node.get_node_by_ids(
            [connection.connect_node_id for connection in connections]
        )

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
                "childNodeNum": min(
                    len(
                        Connection.get_connection_by_node_id(
                            relation_node.id, higher_limit
                        ),
                        res_node_limit,
                    ),
                ),
            }
            for relation_node in relation_nodes or []
        ],
    }


# 記事の名前を元にノードを取得する
def search_node(
    node_query: str, search_limit: int, higher_limit: int, res_node_limit: int
):
    current_node = Node.get_node_by_node_name_perfection(node_query)
    if current_node is None:
        return search_node_partial(node_query, search_limit)

    connections = Connection.get_connection_by_node_id(current_node.id, higher_limit)
    if connections is not None:
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
                "childNodeNum": min(
                    len(Connection.get_connection_by_node_id(relation_node.id)),
                    res_node_limit,
                ),
            }
            for relation_node in relation_nodes
        ],
    }


# 記事の名前を元にノードを取得する (部分一致)
def search_node_partial(node_query: str, search_limit: int):
    suggestions = Node.get_node_by_node_name_partial(node_query, search_limit)
    if suggestions is None:
        return []

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
