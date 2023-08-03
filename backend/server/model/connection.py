from typing import Optional

from sqlmodel import Field, Relationship, SQLModel, select, or_

from model.node import Node
from settings import get_db_engine, get_db_session


class Connection(SQLModel, table=True):
    id: Optional[int] = Field(primary_key=True)
    node_id: Optional[int] = Field(foreign_key="node.id")
    connect_node_id: Optional[int] = Field(foreign_key="connect_node.id")
    connection_strength: int

    node: Optional[Node] = Relationship(back_populates="connections")
    connect_node: Optional[Node] = Relationship(back_populates="connections")

    @classmethod
    def get_connection_by_node_id(cls, node_id: int):
        session = get_db_session()
        stmt = select(Connection).where(
            # or_(Connection.node_id == node_id, Connection.connect_node_id == node_id)
            Connection.node_id
            == node_id
        )
        result = session.exec(stmt).all()
        session.close()
        return result


def create_table():
    SQLModel.metadata.create_all(bind=get_db_engine())
