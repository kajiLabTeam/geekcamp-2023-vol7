import sqlite3

# データベースのパス
DB_PATH = "connection.db"

# データベースに接続
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

query = "Python"
item = {
    "name": "python",
    "display_name": "Python",
    "short_description": "Python is a general-purpose programming language, created by Guido van Rossum, and is named after the comedy television show Monty Python's Flying Circus.",
    "description": "Python is a general-purpose programming language, created by Guido van Rossum, and is named after the comedy television show Monty Python's Flying Circus. Python can be used for everything from video games to server-side web applications to fully fledged desktop applications. It is a great language to learn if you are just starting out programming.",
    "created_by": "Guido van Rossum",
    "released": "1991",
    "created_at": "2014-01-12T10:06:08Z",
    "updated_at": "2021-05-27T13:39:03Z",
    "featured": True,
    "curated": True,
    "score": 1.0,
}
last_up = item["updated_at"]
last_up = last_up.replace("-", ".")
# 最初の10文字を取得
last_up = last_up[:10]

description = item["description"]

# articlesテーブルに値を追加
# update_query = "UPDATE articles " "SET tag = ?, article = ?, last_up = ?"
# cursor.execute(update_query, (query, description, last_up))
# cursor.execute(f"UPDATE articles SET tag = '{query}'")
cursor.execute(
    "INSERT INTO articles (tag, article, last_up) VALUES (?, ?, ?);",
    (query, description, last_up),
)
conn.commit()

# SELECT文を実行してデータを取得
select_query = "SELECT * FROM articles"
cursor.execute(select_query)
result = cursor.fetchall()

for row in result:
    print(row)

conn.close()

print("end")
