import sqlite3
import time
from datetime import datetime

from model.article import Article
from model.connection import Connection
from model.node import Node

conn = sqlite3.connect("./init/data.db")
conn = sqlite3.connect("./init/data.db")
cur = conn.cursor()


def insert_node_article():
    all_node = cur.execute(
        """
        SELECT tag
        FROM node
        ORDER BY items_count DESC
    """
    ).fetchall()

    output_filename = "./init/article/all_articles.sql"  # すべての記事を出力するファイル名
    output_filename1 = "./init/article/all_nodes.sql"  # すべての記事を出力するファイル名

    for i, node in enumerate(all_node):
        node_name = node[0]
        res = cur.execute(
            "SELECT article FROM article_tmp WHERE node_name=?", (node_name,)
        ).fetchone()

        print(f"\n\nA-------------{i}--------------\n\n")

        randn = int(time.time() * 10000 + i)
        article_id = int(str(randn)[-9:]) if res is not None else None

        node = Node(node_name=node_name, article_id=article_id)
        Node.insert_node(node)
        # 記事をファイルに追記して出力
        with open(output_filename1, "a") as output_file:
            output_file.write(
                f'INSERT INTO\n    node (node_name, article_id)\nVALUES\n    (\n        "{node_name}",\n        {article_id},\n    );\n'
            )

        if res != None:
            last_update = datetime.now()
            article = Article(id=article_id, article=res[0], last_update=last_update)
            Article.insert_article(article)

            # 記事をファイルに追記して出力
            with open(output_filename, "a") as output_file:
                output_file.write(
                    f'INSERT INTO\n    article (id, article, last_update)\nVALUES\n    (\n        {article_id},\n        "{res[0]}",\n        "{last_update}"\n    );\n'
                )


def insert_connection():
    output_filename = "./init/article/all_connections.sql"  # すべての記事を出力するファイル名

    all_connection = cur.execute(
        """
        SELECT node_id, connect_node_id, connection_strength 
        FROM connection
        ORDER BY connection_strength DESC
    """
    ).fetchall()

    for i, connection in enumerate(all_connection):
        print(f"\n\nB-------------{i}--------------\n\n")
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
        Connection.insert_connection(connection)

        # 記事をファイルに追記して出力
        with open(output_filename, "a") as output_file:
            output_file.write(
                f"INSERT INTO\n    connection (node_id, connect_node_id, connection_strength)\nVALUES\n    (\n        {node.id},\n        {connect_node.id},\n        {connection_strength},\n    );\n"
            )

        print(
            "\n\n-------------", node.id, connect_node.id, connection_strength, "\n\n"
        )


def insert_all_data():
    insert_node_article()
    insert_connection()
