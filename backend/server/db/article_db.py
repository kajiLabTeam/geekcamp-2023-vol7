from db.error.db_error import DBErrorType, db_error
from model.article import Article
from model.edit_history import EditHistory
from model.node import Node


def get_article(node_id: int):
    if not node_id:
        return {"message": db_error(DBErrorType.NOT_SELECTED_NODE_ID_ERROR)}

    node = Node.get_node_by_id(node_id)
    if node is None:
        return {"message": db_error(DBErrorType.NODE_IS_EMPTY_ERROR)}

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


def put_article(article_id: int, article_content: str):
    # edit_history = EditHistory.insert_edit_history(EditHistory(article_id=article_id))
    if not article_id:
        return {"message": db_error(DBErrorType.NOT_SELECTED_ARTICLE_ID_ERROR)}

    if not article_content:
        return {"message": db_error(DBErrorType.NOT_SELECTED_ARTICLE_CONTENT_ERROR)}

    article = Article.put_article_by_id(article_id, article_content)
    if article is None:
        return []

    node = Node.get_node_by_article_id(article.id)
    if node is None:
        return {"message": db_error(DBErrorType.NODE_IS_EMPTY_ERROR)}

    return {
        "id": article.id,
        "nodeId": node.id,
        "name": node.node_name,
        "article": article.article,
        "lastUpdate": article.last_update,
    }
