from fastapi import APIRouter, Request

from db.user_db import register_user as db_register_user

router = APIRouter()


# ノードのIDを元に記事を取得する
@router.post("/user/post")
async def register_user(articleId: int, request: Request):
    data = await request.json()
    uid = data.get("uid", "")
    name = data.get("name", "")

    user = db_register_user(uid, name)

    return user
