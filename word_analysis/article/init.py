import requests
import os
from dotenv import load_dotenv
import pandas as pd
import wikipedia
import sqlite3
import datetime
from time import sleep
import sys

DB_PATH = "connection.db"
# GITHUB_TOKENを環境変数から取得
load_dotenv()
GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")

# データベースに接続
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# 今日の日付を取得
today = datetime.date.today()
today = str(today)
today = today.replace("-", ".")
today = today[2:]


def add_db(query, description, last_up):
    cursor.execute(
        "INSERT INTO articles (tag, article, last_up) VALUES (?, ?, ?);",
        (query, description, last_up),
    )
    conn.commit()


def get_summary_from_github(query):
    headers = {"Authorization": f"Bearer {GITHUB_TOKEN}"}
    url = f"https://api.github.com/search/topics?per_page=100&q={query}"
    response = requests.get(url, headers=headers)
    data = response.json()

    # queryを小文字に
    lower_query = query.lower()
    # #をsharp、++をppに
    lower_query = lower_query.replace("#", "sharp").replace("++", "pp")

    # queryを大文字に
    upper_query = query.upper()

    # "name"とquerryの一致するものの、"description","updated_at"を取得
    try:
        for item in data["items"]:
            if (
                item["name"] == query
                or item["name"] == lower_query
                or item["name"] == upper_query
            ):
                last_up = item["updated_at"]
                last_up = last_up.replace("-", ".")
                # 最初の7文字を取得
                last_up = last_up[:10]
                description = item["description"]

                if description == "NULL":
                    return False
                # dbの"tag"の一番下に格納
                add_db(query, description, last_up)
                return True
    except:
        print(data)
        sys.exit()
    # 一致するものがなかった場合
    return False


def get_summary_from_wikipedia(query):
    text = ""
    url = f"https://ja.wikipedia.org/api/rest_v1/page/summary/{query}"
    response = requests.get(url)
    data = response.json()
    text = data.get("extract", "")
    # textが複数行のとき、textの中身を全て消す
    if "\n" in text:
        text = ""

    # textが空じゃないとき
    if text:
        # dbの"tag"の一番下に格納
        add_db(query, text, today)
        return True
    else:
        return False


# connection.dbのtagsテーブルから"tag"の値を全て取得
cursor.execute("SELECT tag FROM tags WHERE items_count > 15")
all_tag = cursor.fetchall()
all_tag = [tag[0] for tag in all_tag]

# articlesテーブルから"id"の最大値を取得
max_id = 0
cursor.execute("SELECT MAX(id) FROM articles")
max_id = cursor.fetchone()[0] or 0

# all_tagから先頭に#のついた要素を削除
all_tag = [tag for tag in all_tag if tag[0] != "#"]

# 任意の数から処理を再開
counter = max_id
all_tag = all_tag[counter:]


for name in all_tag:
    counter += 1
    if not name:
        name = "None"

    if not get_summary_from_github(name):
        if not get_summary_from_wikipedia(name):
            add_db(name, name, today)
            prosseing = "None"
        else:
            prosseing = "wikipedia"
    else:
        prosseing = "github"

    print(f"ccount:{counter},item:{name},prosseing:{prosseing}")
    sleep(3)

# 最後の処理
conn.close()
