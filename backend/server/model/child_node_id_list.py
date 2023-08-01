from typing import TYPE_CHECKING, Optional
from model.node import Node
from sqlmodel import Field, Relationship, SQLModel
from settings import get_db_engine

if TYPE_CHECKING:
    # Circular Importsによるエラー防止
    from model.node import Node


class ChildNodeIdList(SQLModel, table=True):
    id: Optional[int] = Field(primary_key=True)
    current_node_id: Optional[int] = Field(foreign_key="node.id")
    child_node_id: Optional[int] = Field(foreign_key="node.id")

    current_node: "Node" = Relationship(back_populates="child_nodes")
    child_node: "Node" = Relationship(back_populates="child_nodes")
