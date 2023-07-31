import os
from dotenv import load_dotenv
from sqlmodel import create_engine, Session
from sqlalchemy.orm import scoped_session, sessionmaker

load_dotenv()

user = os.getenv("MYSQL_USER")
password = os.getenv("MYSQL_PASSWORD")
host = os.getenv("MYSQL_HOST")
db_name = os.getenv("MYSQL_DATABASE")

url: str = f'mysql+mysqlconnector://{user}:{password}@{host}/{db_name}'

engine = create_engine(url, echo=True)

session = scoped_session(
    sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=engine
    )
)

base = declarative_base()
base.query = session.query_property()


def get_db_engine():
    return engine

def get_db_session():
    return Session(get_db_engine())