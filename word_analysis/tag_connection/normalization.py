import sqlite3

number = 1

# データベースに接続
conn = sqlite3.connect("connection.db")
cursor = conn.cursor()

cursor.execute("""
    SELECT DISTINCT target_tag
    FROM connection
    WHERE ratio == 0
        AND count > 1
    ORDER BY count ASC
""")
tags = cursor.fetchall()

counter = 0
length = len(tags)
start = int(length * 0.05 * (number - 1))
end = int(length * 0.05 * number)

for tag_snap in tags[start:end]:
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
        cursor.execute(f"""
            UPDATE connection
            SET ratio={(connection[2] - min_) * 10000 / diff_}
            WHERE target_tag='{connection[0]}'
                AND connect_tag='{connection[1]}'
        """)
    conn.commit()

# 接続を閉じる
conn.close()
