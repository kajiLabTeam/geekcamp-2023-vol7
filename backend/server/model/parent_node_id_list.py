from typing import TYPE_CHECKING, Optional
from sqlmodel import Field, Relationship, SQLModel
from model.node import Node
from settings import get_db_engine

if TYPE_CHECKING:
    # Circular Importsによるエラー防止
    from model.node import Node


class ParentNodeIdList(SQLModel, table=True):
    id: Optional[int] = Field(primary_key=True)
    current_node_id: int = Field(foreign_key="node.id")
    parent_node_id: int = Field(foreign_key="node.id")

    current_node: "Node" = Relationship(back_populates="parent_nodes")
    child_node: "Node" = Relationship(back_populates="parent_nodes")


def create_table():
    SQLModel.metadata.create_all(bind=get_db_engine())
