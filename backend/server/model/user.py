from datetime import datetime
from typing import TYPE_CHECKING, List, Optional

from settings import get_db_engine, get_db_session
from sqlalchemy.exc import SQLAlchemyError
from sqlmodel import Field, Relationship, SQLModel, select

if TYPE_CHECKING:
    # Circular Importsによるエラー防止
    from model.edit_history import EditHistory


class User(SQLModel, table=True):
    id: Optional[str] = Field(primary_key=True)
    name: str = Field(unique=False, nullable=False)

    edit_histories: List["EditHistory"] = Relationship(back_populates="user")

    @classmethod
    # ユーザーIDを元にユーザーを取得する
    def get_user_by_id(cls, user_id: int):
        session = get_db_session()
        stmt = select(User).where(User.id == user_id)
        result = session.exec(stmt).first()
        session.close()
        return result

    @classmethod
    # ユーザーIDを元にユーザーを取得する
    def insert_user(cls, user: "User"):
        session = get_db_session()
        session.add(user)
        session.commit()
        session.refresh(user)
        session.close()


def create_table():
    SQLModel.metadata.create_all(bind=get_db_engine())
