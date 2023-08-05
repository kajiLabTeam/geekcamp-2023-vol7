import sqlite3

# データベースのパス
DB_PATH = "connection.db"

# データベースに接続
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# articlesの中身を全て削除
cursor.execute("DELETE FROM articles")
conn.commit()

# articlesの中身を全て取得
cursor.execute("SELECT * FROM articles")
res = cursor.fetchall()
print(res)

conn.close()
