import sqlite3

# データベースのパス
DB_PATH = "connection.db"

# データベースに接続
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# articlesのarticleの中身が"None"のものを1行ずつ全て取得
cursor.execute("SELECT * FROM articles WHERE article = 'None'")
res = cursor.fetchall()

# tagを表示
for i in res:
    query = ""
    print(i[1])
    query = input(f"{i[1]}の説明を入力してください。")
    cursor.execute(
        "UPDATE articles SET article = ? WHERE tag = ?",
        (query, i[1]),
    )
    conn.commit()
