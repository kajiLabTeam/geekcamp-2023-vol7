from datetime import datetime
from typing import TYPE_CHECKING, List, Optional

from settings import get_db_engine, get_db_session
from sqlalchemy.exc import SQLAlchemyError
from sqlmodel import Field, Relationship, SQLModel, select

if TYPE_CHECKING:
    # Circular Importsによるエラー防止
    from model.edit_history import EditHistory


class User(SQLModel, table=True):
    id: Optional[int] = Field(primary_key=True)
    name: str = Field(unique=False, nullable=False)

    edit_histories: List["EditHistory"] = Relationship(back_populates="user")

    @classmethod
    def get_user_by_id(cls, user_id: int):
        if not user_id:
            return None

        try:
            session = get_db_session()
            stmt = select(User).where(User.id == user_id)
            result = session.exec(stmt).first()
            session.close()
            return result
        except SQLAlchemyError as e:
            print(f"An error occurred: {e}")
            return None


def create_table():
    SQLModel.metadata.create_all(bind=get_db_engine())
