from datetime import datetime
from typing import TYPE_CHECKING, List, Optional

from model.edit_history import EditHistory
from settings import get_db_engine, get_db_session
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
    def get_connection_by_id(cls, article_id: int):
        session = get_db_session()
        stmt = select(Article).where(Article.id == article_id)
        result = session.exec(stmt).first()
        session.close()
        return result


def create_table():
    SQLModel.metadata.create_all(bind=get_db_engine())
