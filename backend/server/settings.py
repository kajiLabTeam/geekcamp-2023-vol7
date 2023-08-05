import os
import time

from dotenv import load_dotenv
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlmodel import Session, create_engine


def create_engine_with_retry(url, max_retries=180, retry_interval=5):
    retries = 0
    engine = None

    while retries < max_retries:
        try:
            engine = create_engine(url, echo=True)
            break
        except OperationalError:
            retries += 1
            print(
                f"Failed to connect to the database. Retrying in {retry_interval} seconds..."
            )
            time.sleep(retry_interval)

    if engine is None:
        raise Exception("Failed to connect to the database after maximum retries.")

    return engine


load_dotenv()

user = os.getenv("MYSQL_USER")
password = os.getenv("MYSQL_PASSWORD")
host = os.getenv("MYSQL_HOST")
db_name = os.getenv("MYSQL_DATABASE")

url: str = f"mysql+mysqlconnector://{user}:{password}@{host}/{db_name}"

engine = create_engine_with_retry(url)

session = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))


def get_db_engine():
    return engine


def get_db_session():
    with Session(engine) as session:
        return session
