from fastapi import APIRouter, Request

from db.article_db import get_article as db_get_article
from db.article_db import put_article as db_put_article

router = APIRouter()


# ノードのIDを元に記事を取得する
@router.get("/article/info/{nodeId}")
async def get_article(nodeId: int):
    article = db_get_article(nodeId)

    return article


# 記事のIDと記事の内容を元に記事を編集する
@router.put("/article/edit/{articleId}")
async def get_article(articleId: int, request: Request):
    data = await request.json()
    article = data.get("article", "")

    article = db_put_article(articleId, article)

    return article
