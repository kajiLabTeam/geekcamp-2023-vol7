from model.article import Article
from model.edit_history import EditHistory
from model.node import Node


def get_article(node_id: int):
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
    # edit_history = EditHistory.insert_edit_history(EditHistory(article_id=article_id))

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
