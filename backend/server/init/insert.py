import sqlite3
from datetime import datetime
import time

from model.article import Article
from model.connection import Connection
from model.node import Node


conn = sqlite3.connect("./data.db")
cur = conn.cursor()


def insert_node_article():
    all_node = cur.execute('''
        SELECT tag
        FROM node
        ORDER BY items_count DESC
        LIMIT 1000
    ''').fetchall()

    for i, node in enumerate(all_node):
        node_name = node[0]
        res = cur.execute(
            'SELECT article FROM article_tmp WHERE node_name=?', (node_name,)
        ).fetchone()

        print(f'\n\nA-------------{i}--------------\n\n') 

        randn = int(time.time() * 10000 + i)
        article_id = res != None and int(str(randn)[-9:])

        node = Node(node_name=node_name, article_id=article_id)
        Node.insert_node(node)
        if res != None:
            last_update = datetime.now()
            article = Article(
                id=article_id, article=res[0], last_update=last_update)
            Article.insert_article(article)


def insert_connection():
    all_connection = cur.execute('''
        SELECT node_id, connect_node_id, connection_strength 
        FROM connection
        ORDER BY connection_strength DESC
        LIMIT 10000
    ''').fetchall()


    for i, connection in enumerate(all_connection):
        print(f'\n\nB-------------{i}--------------\n\n')
        node_name = connection[0]
        connect_node_name = connection[1]
        connection_strength = connection[2]

        node = Node.get_node_by_node_name_perfection(node_name)
        connect_node = Node.get_node_by_node_name_perfection(connect_node_name)

        if node == None or connect_node == None:
            print(node, ">>>>>>>>>>>>>>>>>>>>>node or connect_node is None")
            continue

        connection = Connection(
            node_id=node.id,
            connect_node_id=connect_node.id,
            connection_strength=connection_strength,
        )
        print("\n\n-------------", node.id,
              connect_node.id, connection_strength, "\n\n")
        Connection.insert_connection(connection)


def insert_all_data():
    insert_node_article()
    insert_connection()
