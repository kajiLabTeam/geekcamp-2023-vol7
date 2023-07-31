from typing import TYPE_CHECKING, Optional
from sqlmodel import Field, Relationship, SQLModel
from settings import get_db_engine

if TYPE_CHECKING:
    # Circular Importsによるエラー防止
    from model.article import Article
    from model.child_node_id_list import ChildNodeIdList
    from model.parent_node_id_list import ParentNodeIdList


class Node(SQLModel, table=True):
    id: Optional[int] = Field(primary_key=True)
    node_name: str
    article_id: Optional[int] = Field(foreign_key="article.id")
    article: "Article" = Relationship(back_populates="nodes")
    child_nodes: list["ChildNodeIdList"] = Relationship(back_populates="node")
    parent_nodes: list["ParentNodeIdList"] = Relationship(back_populates="node")


def create_table():
    SQLModel.metadata.create_all(bind=get_db_engine())
