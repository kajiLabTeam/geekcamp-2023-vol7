from typing import TYPE_CHECKING, List, Optional, Tuple

from cerberus import Validator
from sqlmodel import Field, Relationship, SQLModel, select

from model.article import Article
from settings import get_db_engine, get_db_session

if TYPE_CHECKING:
    from model.connection import Connection


class Node(SQLModel, table=True):
    id: Optional[int] = Field(primary_key=True)
    node_name: str
    article_id: Optional[int]
    # article: Optional[Article] = Relationship(back_populates="nodes")

    @classmethod
    def get_allnode(cls) -> List["Node"] | None:
        session = get_db_session()
        stmt = select(Node.node_name).distinct()
        result = session.exec(stmt).all()
        session.close()
        return result

    @classmethod
    # ノードのIDを元にノードを取得する (Node型で)
    def get_node_by_id(cls, node_id: int) -> List["Node"] | None:
        session = get_db_session()
        stmt = select(Node).where(Node.id == node_id)
        result = session.exec(stmt).first()
        session.close()
        return result

    @classmethod
    # 記事のIDを元にノードを取得する
    def get_node_by_article_id(cls, article_id: int) -> List["Node"] | None:
        session = get_db_session()
        stmt = select(Node).where(Node.article_id == article_id)
        result = session.exec(stmt).first()
        session.close()
        return result

    @classmethod
    # 複数あるノードのIDを元にノードを取得する (Listで)
    def get_node_by_ids(cls, node_ids: list) -> List["Node"] | None:
        session = get_db_session()
        stmt = select(Node).where(Node.id.in_(node_ids))
        result = session.exec(stmt).all()
        session.close()
        return result

    @classmethod
    # ノードの名前を元にノードを取得する (完全一致)
    def get_node_by_node_name_perfection(cls, node_query: str) -> List["Node"] | None:
        session = get_db_session()
        stmt = select(Node).where(Node.node_name == node_query)
        result = session.exec(stmt).first()
        session.close()
        return result

    @classmethod
    # ノードの名前を元にノードを取得する (部分一致)
    def get_node_by_node_name_partial(
        cls, node_query: str, search_limit: int
    ) -> List["Node"] | None:
        session = get_db_session()
        stmt = (
            select(Node)
            .where(Node.node_name.like(f"%{node_query}%"))
            .limit(search_limit)
        )
        result = session.exec(stmt).all()
        session.close()
        return result

    @classmethod
    # Node型の値を受け取り、そのデータをDBに追加
    def insert_node(cls, node: "Node"):
        session = get_db_session()
        session.add(node)
        session.commit()
        session.refresh(node)
        session.close()


def create_table():
    SQLModel.metadata.create_all(bind=get_db_engine())
