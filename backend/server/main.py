from fastapi import FastAPI
from model.table import create_all_tables
from router.article import router as article_router
from router.node import router as node_router

create_all_tables()


app = FastAPI()

app.include_router(article_router, prefix="/api", tags=["article"])
app.include_router(node_router, prefix="/api", tags=["node"])
