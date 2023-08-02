from datetime import datetime
from typing import TYPE_CHECKING, Optional
from sqlmodel import SQLModel, DateTime, Relationship, Field
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

    user: list["User"] = Relationship(back_populates="user")
    article: list["Article"] = Relationship(back_populates="article")
    
    class Meta:
        table = "edit_history"


def create_table():
    SQLModel.metadata.create_all(bind=get_db_engine())
