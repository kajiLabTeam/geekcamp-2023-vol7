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
    article_id: Optional[int] = Field(foreign_key="article.id")

    article: Optional[Article] = Relationship(back_populates="nodes")

    connections: List["Connection"] = Relationship(back_populates="node")

    @classmethod
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
    def get_connection_node_by_ids(cls, node_ids: list) -> List["Node"] | None:
        if not node_ids:
            return []

        try:
            session = get_db_session()
            stmt = select(Node).where(Node.id.in_(node_ids))
            result = session.exec(stmt).all()
            session.close()
            return result
        except SQLAlchemyError as e:
            print(f"An error occurred: {e}")
            return None


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
