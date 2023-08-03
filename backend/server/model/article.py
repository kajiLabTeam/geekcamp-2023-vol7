from datetime import datetime
from typing import TYPE_CHECKING, List, Optional

from sqlmodel import DateTime, Field, Relationship, SQLModel

from model.edit_history import EditHistory
from settings import get_db_engine

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


def create_table():
    SQLModel.metadata.create_all(bind=get_db_engine())
