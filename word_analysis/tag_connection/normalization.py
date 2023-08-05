import sqlite3
import numpy as np
import pandas as pd

# データベースに接続
conn = sqlite3.connect("connection.db")
cursor = conn.cursor()

cursor.execute("SELECT DISTINCT target_tag FROM connection")
tags = cursor.fetchall()

counter = 0

for tag_snap in tags:
    tag = tag_snap[0]
    print(f"----- {tag} -----")

    cursor.execute(f"""
        SELECT MAX(count), MIN(count)
        FROM connection
        WHERE target_tag = '{tag}'
    """)
    (max_, min_) = cursor.fetchone()

    cursor.execute(f"""
        SELECT target_tag, connect_tag, count
        FROM connection
        WHERE target_tag='{tag}'
    """)
    connections = cursor.fetchall()

    diff_ = max_ - min_
    for connection in connections:
        print(connection[1])
        normalized_count = (connection[2] - min_) / diff_
        cursor.execute(f"""
            UPDATE connection
            SET ratio={int(normalized_count*10000)}
            WHERE target_tag='{connection[0]}'
                AND connect_tag='{connection[1]}'
        """)
        conn.commit()

# 接続を閉じる
conn.close()
