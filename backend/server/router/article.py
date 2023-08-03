from fastapi import APIRouter

from db.article_db import get_article

router = APIRouter()


@router.get("/search/article/{nodeId}")
async def get_article(node_id: int):
    # db から記事情報を取得する
    # article = get_article(node_id)
    # return {"article": article}

    return {"message": "Hello Article"}
