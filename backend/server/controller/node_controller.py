import datetime as t
from typing import List

from sqlalchemy import func

from model.node import Node
from settings import get_db_session


def get_node(node_id: str) -> Node | None:
    """指定したノードを取得する

    Args:
        node_id (str): ノードID

    Returns:
        Node: ノード
    """
    
    session = get_db_session()
    # ノードIDを元にchild_node_id_list、parent_node_id_listに検索をかけ
    # child_nodesとparent_nodesに検索して得た値を代入する
    
   
    session.close()
    return node


def add_node(node: Node):
    """ノードを追加する

    Args:
        uid (str): ユーザーID
        spending_amount (int): 支出額
    """
    session = get_db_session()

    

    session.commit()
    session.close()