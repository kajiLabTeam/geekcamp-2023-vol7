from datetime import datetime
from typing import TYPE_CHECKING, List, Optional

from sqlmodel import DateTime, Field, Relationship, SQLModel, select

from model.user import User
from settings import get_db_engine, get_db_session

if TYPE_CHECKING:
    # Circular Importsによるエラー防止
    from model.article import Article
    from model.user import User


class EditHistory(SQLModel, table=True):
    __tablename__ = "edit_history"

    id: Optional[int] = Field(primary_key=True)
    edit_date: datetime = Field(DateTime, nullable=False)
    user_id: int = Field(foreign_key="user.id")
    article_id: int = Field(foreign_key="article.id")

    user: List["User"] = Relationship(back_populates="edit_histories")
    article: List["Article"] = Relationship(back_populates="edit_histories")

    @classmethod
    # ユーザーのIDを元に編集履歴を取得する
    def get_edit_history_by_user_id(cls, user_id: int) -> List["EditHistory"] | None:
        session = get_db_session()
        stmt = select(EditHistory).where(EditHistory.user_id == user_id)
        result = session.exec(stmt).all()
        session.close()
        return result

    @classmethod
    # 記事のIDを元に編集履歴を取得する
    def get_edit_history_by_article_id(
        cls, article_id: int
    ) -> List["EditHistory"] | None:
        session = get_db_session()
        stmt = select(EditHistory).where(EditHistory.article_id == article_id)
        result = session.exec(stmt).all()
        session.close()
        return result

    @classmethod
    # 記事のIDを元に編集履歴を取得する
    def insert_edit_history(
        cls, edit_history: "EditHistory"
    ) -> List["EditHistory"] | None:
        session = get_db_session()
        session.add(edit_history)
        session.commit()
        session.refresh(edit_history)
        session.close()


def create_table():
    SQLModel.metadata.create_all(bind=get_db_engine())
