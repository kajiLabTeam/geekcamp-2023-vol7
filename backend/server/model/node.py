from typing import TYPE_CHECKING, Optional
from sqlmodel import Field, Relationship, SQLModel
from settings import get_db_engine

if TYPE_CHECKING:
    # Circular Importsによるエラー防止
    from model.article import Article
    from model.connection import Connection


class Node(SQLModel, table=True):
    id: Optional[int] = Field(primary_key=True)
    name: str
    article_id: Optional[int] = Field(foreign_key="article.id")

    article: "Article" = Relationship(back_populates="nodes")
    relation_nodes: list["Connection"] = Relationship(back_populates="connection")


def create_table():
    SQLModel.metadata.create_all(bind=get_db_engine())
