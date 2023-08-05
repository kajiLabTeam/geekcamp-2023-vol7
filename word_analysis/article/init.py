import requests
import os
import csv
import pandas as pd
import wikipedia
import sqlite3


def get_summary_from_wikipedia(query):
    url = f"https://ja.wikipedia.org/api/rest_v1/page/summary/{query}"
    response = requests.get(url)
    data = response.json()
    return data.get("extract", "")


# result/jaccard_coef_data_{tag}.csvのデータを全て取得
with open("data/tags.csv", "r", encoding="utf-8") as file:
    lines = file.readlines()
    # linesの各値で"\n"を削除
    lines = [line.replace("\n", "") for line in lines]
all_tag = lines
all_tag = all_tag[266:]

for name in all_tag:
    print(name)
    if not name:
        continue

    summary = get_summary_from_wikipedia(name)

    if not summary:
        print(f"Unfind: {name}")

    print(summary)
    judge = input()
    if judge:
        summary = judge

    with open(f"data/wiki/{name}.txt", "w", encoding="utf-8") as file:
        file.write(summary)

    print(f"storage: {name}")
