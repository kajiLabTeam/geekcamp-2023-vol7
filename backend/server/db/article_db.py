import datetime as t
from typing import List

from model.article import Article
from settings import get_db_session


def get_article(node_id: str) -> Article | None:
    """指定したノードを元に記事を取得する

    Args:
        node_id (str): ノードID

    Returns:
        Article: 記事
    """

    session = get_db_session()
    # ノードIDを元にarticle テーブルに検索をかけ記事情報を取得する

    session.close()
    return article
