from datetime import datetime
from typing import TYPE_CHECKING, List, Optional

from sqlmodel import DateTime, Field, Relationship, SQLModel

from model.user import User
from settings import get_db_engine

if TYPE_CHECKING:
    # Circular Importsによるエラー防止
    from model.article import Article
    from model.user import User


class EditHistory(SQLModel, table=True):
    __tablename__ = "edit_history"

    id: Optional[int] = Field(primary_key=True)
    edit_date: datetime = Field(DateTime, nullable=False)
    user_id: int = Field(foreign_key="user.id")
    article_id: int = Field(foreign_key="article.id")

    user: List["User"] = Relationship(back_populates="edit_histories")
    article: List["Article"] = Relationship(back_populates="edit_histories")


def create_table():
    SQLModel.metadata.create_all(bind=get_db_engine())
