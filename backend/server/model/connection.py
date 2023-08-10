from typing import List, Optional

from model.node import Node
from settings import get_db_engine, get_db_session
from sqlmodel import Field, Relationship, SQLModel, select


class Connection(SQLModel, table=True):
    id: Optional[int] = Field(primary_key=True)
    node_id: Optional[int]
    connect_node_id: Optional[int]
    connection_strength: int

    # node: Optional[Node] = Relationship(back_populates="connections")
    # connect_node: Optional[Node] = Relationship(back_populates="connections")

    @classmethod
    # ノードIDを元にノードを取得する (List["Connection"]型 & 上位100個)
    def get_connection_by_node_id(
        cls, node_id: int, extracted_node_limit: int
    ) -> List["Connection"] | None:
        session = get_db_session()
        stmt = (
            select(Connection)
            .where(Connection.node_id == node_id)
            .order_by(Connection.connection_strength.desc())
            .limit(extracted_node_limit)
        )
        result = session.exec(stmt).all()
        session.close()
        return result

    @classmethod
    # 複数のノードIDを元にノードを取得する (List型で)
    def get_connection_by_node_ids(cls, node_ids: list) -> List["Connection"] | None:
        session = get_db_session()
        stmt = select(Connection).where(Connection.node_id.in_(node_ids))
        result = session.exec(stmt).all()
        session.close()
        return result

    @classmethod
    # Connection型の値を受け取り、そのデータをDBに追加
    def insert_connection(cls, connection: "Connection") -> List["Connection"] | None:
        session = get_db_session()
        session.add(connection)
        session.commit()
        session.refresh(connection)
        session.close()
        return connection


def create_table():
    SQLModel.metadata.create_all(bind=get_db_engine())
