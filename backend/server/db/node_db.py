from model.connection import Connection
from model.node import Node


def get_nodes(node_id: int):
    """指定したノードを取得する

    Args:
        node_id (str): ノードID

    Returns:
        Node: ノード
    """

    current_node = Node.get_node_by_id(node_id)
    if current_node is None:
        return None

    connections = Connection.get_connection_by_node_id(current_node.id)
    if connections is None:
        return None

    relation_nodes = Node.get_node_by_ids(
        [connection.connect_node_id for connection in connections]
    )
    if relation_nodes is None:
        return None

    return {
        "currentNode": {
            "id": current_node.id,
            "name": current_node.node_name,
            "articleId": current_node.article_id,
            "childNodeNum": len(relation_nodes),
        },
        "relationNode": [
            {
                "id": relation_node.id,
                "name": relation_node.node_name,
                "articleId": relation_node.article_id,
                "childNodeNum": len(
                    Connection.get_connection_by_node_id(relation_node.id)
                ),
            }
            for relation_node in relation_nodes
        ],
    }


def search_node(node_query: str):
    """ノードを追加する

    Args:
        uid (str): ユーザーID
        spending_amount (int): 支出額
    """
    current_node = Node.get_node_by_node_name_perfection(node_query)
    if current_node is None:
        return search_node_partial(node_query)

    connections = Connection.get_connection_by_node_id(current_node.id)
    if connections is None:
        return None

    relation_nodes = Node.get_node_by_ids(
        [connection.connect_node_id for connection in connections]
    )
    if relation_nodes is None:
        return None

    return {
        "type": "node",
        "currentNode": {
            "id": current_node.id,
            "name": current_node.node_name,
            "articleId": current_node.article_id,
            "childNodeNum": len(relation_nodes),
        },
        "relationNode": [
            {
                "id": relation_node.id,
                "name": relation_node.node_name,
                "articleId": relation_node.article_id,
                "childNodeNum": len(
                    Connection.get_connection_by_node_id(relation_node.id)
                ),
            }
            for relation_node in relation_nodes
        ],
    }


def search_node_partial(node_query: str):
    suggestions = Node.get_node_by_node_name_partial(node_query)
    if suggestions is None:
        return None

    return {
        "type": "suggestion",
        "suggestions": [
            {
                "id": suggestion_node.id,
                "name": suggestion_node.node_name,
                "articleId": suggestion_node.article_id,
            }
            for suggestion_node in suggestions
        ],
    }
