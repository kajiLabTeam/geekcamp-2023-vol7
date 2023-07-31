from model.tables import create_all_tables
# from settings import get_db_engine

# print(get_db_engine())

create_all_tables()





# from fastapi import FastAPI

# app = FastAPI()

# @app.get("/")
# async def root():
#     return {"greeting":"Hello world"}