from typing import TYPE_CHECKING, List, Optional, Tuple

from cerberus import Validator
from model.article import Article
from settings import get_db_engine, get_db_session
from sqlalchemy.exc import SQLAlchemyError
from sqlmodel import Field, Relationship, SQLModel, select

if TYPE_CHECKING:
    from model.connection import Connection


class Node(SQLModel, table=True):
    id: Optional[int] = Field(primary_key=True)
    node_name: str
    article_id: Optional[int]
    # article: Optional[Article] = Relationship(back_populates="nodes")

    @classmethod
    def get_allnode(cls) -> List["Node"] | None:
        try:
            session = get_db_session()
            stmt = select(Node.node_name).distinct()
            result = session.exec(stmt).all()
            session.close()
            return result
        except SQLAlchemyError as e:
            print(f"An error occurred: {e}")
            return None

    @classmethod
    # ノードのIDを元にノードを取得する (Node型で)
    def get_node_by_id(cls, node_id: int) -> List["Node"] | None:
        if not node_id:
            return None

        try:
            session = get_db_session()
            stmt = select(Node).where(Node.id == node_id)
            result = session.exec(stmt).first()
            session.close()
            return result
        except SQLAlchemyError as e:
            print(f"An error occurred: {e}")
            return None

    @classmethod
    # 記事のIDを元にノードを取得する
    def get_node_by_article_id(cls, article_id: int) -> List["Node"] | None:
        if not article_id:
            return None

        try:
            session = get_db_session()
            stmt = select(Node).where(Node.article_id == article_id)
            result = session.exec(stmt).first()
            session.close()
            return result
        except SQLAlchemyError as e:
            print(f"An error occurred: {e}")
            return None

    @classmethod
    # 複数あるノードのIDを元にノードを取得する (Listで)
    def get_node_by_ids(cls, node_ids: list) -> List["Node"] | None:
        if not node_ids:
            return None

        try:
            session = get_db_session()
            stmt = select(Node).where(Node.id.in_(node_ids))
            result = session.exec(stmt).all()
            session.close()
            return result
        except SQLAlchemyError as e:
            print(f"An error occurred: {e}")
            return None

    @classmethod
    # ノードの名前を元にノードを取得する (完全一致)
    def get_node_by_node_name_perfection(cls, node_query: str) -> List["Node"] | None:
        try:
            session = get_db_session()
            stmt = select(Node).where(Node.node_name == node_query)
            result = session.exec(stmt).first()
            session.close()
            return result
        except SQLAlchemyError as e:
            print(f"An error occurred: {e}")
            return None

    @classmethod
    # ノードの名前を元にノードを取得する (部分一致)
    def get_node_by_node_name_partial(
        cls, node_query: str, search_limit: int
    ) -> List["Node"] | None:
        if not node_query:
            return None

        try:
            session = get_db_session()
            stmt = (
                select(Node)
                .where(Node.node_name.like(f"%{node_query}%"))
                .limit(search_limit)
            )
            result = session.exec(stmt).all()
            session.close()
            return result
        except SQLAlchemyError as e:
            print(f"An error occurred: {e}")
            return None

    @classmethod
    # Node型の値を受け取り、そのデータをDBに追加
    def insert_node(cls, node: "Node"):
        try:
            session = get_db_session()
            session.add(node)
            session.commit()
            session.refresh(node)
            session.close()
        except SQLAlchemyError as e:
            print(f"An error occurred: {e}")
            return e


def validate(params) -> Tuple[bool, dict]:
    schema = {
        "uid": {"type": "string", "required": True, "maxlength": 255},
        "spendingAmount": {"type": "integer", "required": True},
        "date": {"type": "datetime", "required": True},
    }
    v = Validator(schema, allow_unknown=True)
    return v.validate(params), v.errors  # type: ignore


def create_table():
    SQLModel.metadata.create_all(bind=get_db_engine())
