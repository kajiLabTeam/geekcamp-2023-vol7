from datetime import datetime
from typing import TYPE_CHECKING, List, Optional

from model.user import User
from settings import get_db_engine, get_db_session
from sqlalchemy.exc import SQLAlchemyError
from sqlmodel import DateTime, Field, Relationship, SQLModel, select

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

    @classmethod
    def get_edit_history_by_user_id(cls, user_id: int) -> List["EditHistory"] | None:
        if not user_id:
            return None

        try:
            session = get_db_session()
            stmt = select(EditHistory).where(EditHistory.user_id == user_id)
            result = session.exec(stmt).all()
            session.close()
            return result
        except SQLAlchemyError as e:
            print(f"An error occurred: {e}")
            return None

    @classmethod
    def get_edit_history_by_article_id(
        cls, article_id: int
    ) -> List["EditHistory"] | None:
        if not article_id:
            return None

        try:
            session = get_db_session()
            stmt = select(EditHistory).where(EditHistory.article_id == article_id)
            result = session.exec(stmt).all()
            session.close()
            return result
        except SQLAlchemyError as e:
            print(f"An error occurred: {e}")
            return None


def create_table():
    SQLModel.metadata.create_all(bind=get_db_engine())
