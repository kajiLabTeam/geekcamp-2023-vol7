from typing import TYPE_CHECKING, Optional

from sqlmodel import Field, Relationship, SQLModel

from model.node import Node
from settings import get_db_engine

# if TYPE_CHECKING:
#     from model.node import Node


class Connection(SQLModel, table=True):
    id: Optional[int] = Field(primary_key=True)
    node_id: Optional[int] = Field(foreign_key="node.id")
    connect_node_id: Optional[int] = Field(foreign_key="connect_node.id")
    connection_strength: int

    node: Optional[Node] = Relationship(back_populates="connections")
    connect_node: Optional[Node] = Relationship(back_populates="connections")


def create_table():
    SQLModel.metadata.create_all(bind=get_db_engine())
