from model.article import Article
from model.node import Node


def get_article(node_id: int):
    """指定したノードを元に記事を取得する

    Args:
        node_id (str): ノードID

    Returns:
        Article: 記事
    """

    node = Node.get_node_by_id(node_id)
    if node is None:
        return []

    article = Article.get_article_by_id(node.article_id)
    if article is None:
        return []

    return {
        "id": article.id,
        "nodeId": node_id,
        "name": node.node_name,
        "article": article.article,
        "lastUpdate": article.last_update,
    }


def put_article(article_id: int, article: str):
    """指定した記事のIDを元に記事を編集する

    Args:
        node_id (str): ノードID

    Returns:
        Article: 記事
    """

    article = Article.put_article_by_id(article_id, article)
    if article is None:
        return []

    node = Node.get_node_by_article_id(article.id)
    if article is None:
        return []

    return {
        "id": article.id,
        "nodeId": node.id,
        "name": node.node_name,
        "article": article.article,
        "lastUpdate": article.last_update,
    }
