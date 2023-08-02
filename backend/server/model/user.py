from datetime import datetime
from typing import TYPE_CHECKING, Optional
from sqlmodel import SQLModel, Relationship, Field
from settings import get_db_engine

if TYPE_CHECKING:
    # Circular Importsによるエラー防止
    from model.edit_history import EditHistory


class User(SQLModel, table=True):
    id: Optional[int] = Field(primary_key=True)
    name: str = Field(unique=False, nullable=False)

    edit_history: list["EditHistory"] = Relationship(back_populates="edit_history")


def create_table():
    SQLModel.metadata.create_all(bind=get_db_engine())
