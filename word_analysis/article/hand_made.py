import sqlite3
import pyperclip
from bs4 import BeautifulSoup
import requests

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
    pyperclip.copy(i[1])
    url = f"https://www.google.com/search?q={i[1]}%E3%81%A8%E3%AF"
    html = requests.get(url)
    soup = BeautifulSoup(html.text, "html.parser")
    kno_rdesc = soup.find("div", class_="BNeawe s3v9rd AP7Wnd")
    if kno_rdesc is not None:
        text = kno_rdesc.get_text()
        print(text)
    query = input(f"{i[1]}の説明を入力してください。")
    if not query:
        query = text
    cursor.execute(
        "UPDATE articles SET article = ? WHERE tag = ?",
        (query, i[1]),
    )
    conn.commit()
