import requests
import os
import csv
import pandas as pd
import wikipedia
import sqlite3
import datetime
from time import sleep
import sys

DB_PATH = "connection.db"
# GITHUB_TOKEN = "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"
GITHUB_TOKEN = "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"

# データベースに接続
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# 今日の日付を取得
today = datetime.date.today()
today = str(today)
today = today.replace("-", ".")
today = today[2:]


def get_summary_from_github(query):
    headers = {"Authorization": f"Bearer {GITHUB_TOKEN}"}
    url = f"https://api.github.com/search/topics?per_page=100&q={query}"
    response = requests.get(url, headers=headers)
    data = response.json()

    # queryを小文字に
    lower_query = query.lower()
    # #をsharpに
    lower_query = lower_query.replace("#", "sharp")
    # +をpに
    lower_query = lower_query.replace("+", "p")

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
                    description = "None"
                # dbの"tag"の一番下に格納
                cursor.execute(
                    "INSERT INTO articles (tag, article, last_up) VALUES (?, ?, ?);",
                    (query, description, last_up),
                )
                conn.commit()
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
        cursor.execute(
            "INSERT INTO articles (tag, article, last_up) VALUES (?, ?, ?);",
            (query, text, today),
        )
        conn.commit()
        return True
    else:
        return False


# connection.dbのtagsテーブルから"tag"の値を全て取得
cursor.execute("SELECT tag FROM tags WHERE items_count > 15")
all_tag = cursor.fetchall()
all_tag = [tag[0] for tag in all_tag]

# articlesテーブルから"id"の最大値を取得
cursor.execute("SELECT MAX(id) FROM articles")
max_id = cursor.fetchall()
max_id = max_id[0][0]

# all_tagから先頭に#のついた要素を削除
all_tag = [tag for tag in all_tag if tag[0] != "#"]

# all_tagの前10を削除
counter = max_id - 2
all_tag = all_tag[counter:]


for name in all_tag:
    counter += 1

    bool = True
    # print(name)
    if not name:
        continue

    if not get_summary_from_github(name):
        if not get_summary_from_wikipedia(name):
            cursor.execute(
                "INSERT INTO articles (tag, article, last_up) VALUES (?, ?, ?);",
                (name, "None", today),
            )
            conn.commit()
            print(f"ccount:{counter},item:{name},prosseing:None")
        else:
            print(f"ccount:{counter},item:{name},prosseing:wiki")
    else:
        print(f"ccount:{counter},item:{name},prosseing:github")

    sleep(3)

# 最後の処理
conn.close()
