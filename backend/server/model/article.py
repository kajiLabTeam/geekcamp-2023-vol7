from datetime import datetime
from typing import TYPE_CHECKING, List, Optional

from model.edit_history import EditHistory
from settings import get_db_engine, get_db_session
from sqlalchemy.exc import SQLAlchemyError
from sqlmodel import DateTime, Field, Relationship, SQLModel, select

if TYPE_CHECKING:
    # Circular Importsによるエラー防止
    from model.edit_history import EditHistory
    from model.node import Node


class Article(SQLModel, table=True):
    id: Optional[int] = Field(primary_key=True)
    article: str = Field(unique=False, nullable=False)
    last_update: datetime = Field(DateTime, nullable=False)

    nodes: List["Node"] = Relationship(back_populates="article")
    edit_histories: List["EditHistory"] = Relationship(back_populates="article")

    @classmethod
    def get_article_by_id(cls, article_id: int) -> List["Article"] | None:
        if not article_id:
            return None

        try:
            session = get_db_session()
            stmt = select(Article).where(Article.id == article_id)
            result = session.exec(stmt).first()
            session.close()
            return result
        except SQLAlchemyError as e:
            print(f"An error occurred: {e}")
            return None

    @classmethod
    def put_article_by_id(cls, article_id: int, article: str) -> List["Article"] | None:
        if not article_id:
            return None

        try:
            session = get_db_session()
            result = session.get(Article, article_id)
            if not result:
                # 記事が見つからない場合はNoneを返す
                return None

            # 記事を更新する
            result.article = article
            result.last_update = datetime.now()
            session.add(result)
            session.commit()
            session.refresh(result)
            return result
        except SQLAlchemyError as e:
            print(f"An error occurred: {e}")
            return None


def create_table():
    SQLModel.metadata.create_all(bind=get_db_engine())
