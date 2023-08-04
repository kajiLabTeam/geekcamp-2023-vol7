from db.article_db import get_article as db_get_article
from db.article_db import put_article as db_put_article
from fastapi import APIRouter, Request

router = APIRouter()


@router.get("/article/info/{nodeId}")
async def get_article(nodeId: int):
    article = db_get_article(nodeId)

    return article


@router.put("/article/edit/{articleId}")
async def get_article(articleId: int, request: Request):
    data = await request.json()
    article = data.get("article", "")
    article = db_put_article(articleId, article)

    return article
