import csv

from model.article import Article
from model.connection import Connection
from model.node import Node


def insert_article():
    with open("./init/data/article.csv", "r", encoding="utf-8") as file:
        reader = csv.reader(file)
        next(reader)
        for row in reader:
            id = int(row[0])
            article_text = row[1]
            last_update = row[2]

            article = Article(id=id, article=article_text, last_update=last_update)
            Article.insert_article(article)


def insert_node():
    with open("./init/data/node.csv", "r", encoding="utf-8") as file:
        reader = csv.reader(file)
        next(reader)
        for row in reader:
            node_name = row[0]
            article_id = row[1]

            article = Node(node_name=node_name, article_id=article_id)
            Node.insert_node(article)


def insert_connection():
    with open("./init/data/connection.csv", "r", encoding="utf-8") as file:
        reader = csv.reader(file)
        next(reader)
        for row in reader:
            node_id = row[0]
            connect_node_id = row[1]
            connection_strength = row[2]

            connection = Connection(
                node_id=node_id,
                connect_node_id=connect_node_id,
                connection_strength=connection_strength,
            )

            print(connection)

            Connection.insert_connection(connection)


def insert_all_data():
    insert_article()
    insert_node()
    # insert_connection()
