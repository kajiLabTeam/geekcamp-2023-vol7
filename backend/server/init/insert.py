import sqlite3


def dump_data():
    conn = sqlite3.connect("./init/data.db")
    cursor = conn.cursor()

    output = ""

    cursor.execute(f"SELECT id, article, last_update FROM confirm_article;")
    rows = cursor.fetchall()
    for row in rows:
        output += f'INSERT INTO article (id, article, last_update) VALUES ({row[0]}, "{row[1]}", "{row[2]}");\n'

    cursor.execute(f"SELECT node_name, article_id FROM confirm_node;")
    rows = cursor.fetchall()
    for row in rows:
        output += (
            f'INSERT INTO node (node_name, article_id) VALUES ("{row[0]}", {row[1]});\n'
        )

    cursor.execute(
        f"SELECT node_id, connect_node_id, connection_strength FROM confirm_connection;"
    )
    rows = cursor.fetchall()
    for row in rows:
        output += f"INSERT INTO connection (node_id, connect_node_id, connection_strength) VALUES ({row[0]}, {row[1]}, {int(row[2])});\n"

    output_filename = "./init/init.sql"
    with open(output_filename, "w") as f:
        f.write(output)


def format_table():
    conn = sqlite3.connect("./init/data.db")
    cursor = conn.cursor()
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS confirm_article (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            article TEXT,
            last_update TEXT DEFAULT '2023-08-11T09:00:00.00'
        );
    """
    )
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS confirm_node (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            node_name TEXT,
            article_id INTEGER
        );
    """
    )
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS confirm_connection (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            node_id INTEGER,
            connect_node_id INTEGER,
            connection_strength REAL
        );
    """
    )
    cursor.execute("DELETE FROM confirm_node;")
    cursor.execute("DELETE FROM confirm_article;")
    cursor.execute("DELETE FROM confirm_connection;")

    cursor.execute(
        """
        INSERT INTO confirm_article (article) SELECT article FROM article_tmp;
    """
    )

    cursor.execute(
        """
        INSERT INTO confirm_node (node_name, article_id)
        SELECT at.node_name, ac.id
        FROM confirm_article ac
        JOIN article_tmp at ON ac.article = at.article;
    """
    )
    cursor.execute(
        """
        INSERT INTO confirm_connection (node_id, connect_node_id, connection_strength)
        SELECT nc1.id, nc2.id, c.connection_strength
        FROM connection c
        JOIN confirm_node nc1 ON c.node_id = nc1.node_name
        JOIN confirm_node nc2 ON c.connect_node_id = nc2.node_name;
    """
    )

    conn.commit()


def insert_all_data():
    format_table()
    dump_data()


insert_all_data()
