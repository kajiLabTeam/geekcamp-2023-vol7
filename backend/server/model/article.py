from datetime import datetime
from typing import TYPE_CHECKING, Optional
from sqlmodel import SQLModel, DateTime, Relationship, Field
from settings import get_db_engine

if TYPE_CHECKING:
    # Circular Importsによるエラー防止
    from model.node import Node


class Article(SQLModel, table=True):
    id: Optional[int] = Field(primary_key=True)
    contents: str = Field(unique=False, nullable=False)
    updated_at: datetime = Field(DateTime, nullable=False)
    articles: list["Node"] = Relationship(back_populates="article")
