import datetime as t
from typing import List

from model.connection import Connection
from model.node import Node
from settings import get_db_session


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

    relation_nodes = Node.get_connection_node_by_ids(
        [connection.connect_node_id for connection in connections]
    )
    if relation_nodes is None:
        return None

    return {
        "currentNode": {
            "nodeId": current_node.id,
            "name": current_node.node_name,
            "articleId": current_node.article_id,
            # "lastUpdate": current_node[0].last_update,
        },
        "relationNode": [
            {
                "nodeId": relation_node.id,
                "name": relation_node.node_name,
                "articleId": relation_node.article_id,
            }
            for relation_node in relation_nodes
        ],
    }


def add_node(node: Node):
    """ノードを追加する

    Args:
        uid (str): ユーザーID
        spending_amount (int): 支出額
    """
    session = get_db_session()

    session.commit()
    session.close()
