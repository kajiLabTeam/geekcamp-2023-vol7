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
    article_id: Optional[int] = Field(foreign_key="article.id")

    article: Optional[Article] = Relationship(back_populates="nodes")

    connections: List["Connection"] = Relationship(back_populates="node")

    @classmethod
    def get_node_by_id(cls, node_id: int):
        session = get_db_session()
        stmt = select(Node).where(Node.id == node_id)
        result = session.exec(stmt).first()
        return result


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
