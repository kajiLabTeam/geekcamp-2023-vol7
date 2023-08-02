from typing import TYPE_CHECKING, Optional
from model.node import Node
from sqlmodel import Field, Relationship, SQLModel
from settings import get_db_engine

if TYPE_CHECKING:
    # Circular Importsによるエラー防止
    from model.node import Node


class Connection(SQLModel, table=True):
    id: Optional[int] = Field(primary_key=True)
    node_id: Optional[int] = Field(foreign_key="node.id")
    connect_node_id: Optional[int] = Field(foreign_key="node.id")

    node: "Node" = Relationship(back_populates="connection")
    connect_node: "Node" = Relationship(back_populates="connection")


def create_table():
    SQLModel.metadata.create_all(bind=get_db_engine())
