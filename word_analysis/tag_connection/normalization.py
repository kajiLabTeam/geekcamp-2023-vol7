import sqlite3
import numpy as np
import pandas as pd

# データベースのパス
DB_PATH = "connection.db"

# データベースに接続
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# target_tagの値を全て取得
cursor.execute("SELECT target_tag, connect_tag, count FROM connection")
res = cursor.fetchall()
# res[0] が target_tag
# target_tags = cursor.fetchall()
# # target_tagsをタプルからリストに変換
# target_tags = np.array(target_tags).flatten().tolist()

# # connect_tagの値を全て取得
# cursor.execute("SELECT connect_tag FROM connection")
# connect_tags = cursor.fetchall()
# # connect_tagsをタプルからリストに変換
# connect_tags = np.array(connect_tags).flatten().tolist()

# # データベースからカラム "count" の値を全て取得
# cursor.execute("SELECT count FROM connection")
# counts = cursor.fetchall()
# # countsをタプルからリストに変換
# counts = np.array(counts).flatten().tolist()
# print(counts)
# print(type(counts))

cursor.execute("SELECT DISTINCT target_tag FROM connection")
tags = cursor.fetchall()
mins_maxs = []

for tag in tags:
    tmp = []
    cursor.execute(
        f"SELECT MIN(count), MAX(count) FROM connection WHERE target_tag = '{tag[0]}'"
    )
    min_max = cursor.fetchall()
    tmp.append(tag)
    tmp.extend(min_max)
    mins_maxs.append(tmp)

normalized_counts = []
normalized_count = 0

counter = 0

# カラム "count" の値を正規化
for item in res:
    counter += 1
    print(f"{counter},item:{item}")
    # mins_maxsの中からitem[0]と同じ値を持つタプルを取得
    for min_max in mins_maxs:
        if item[0] == min_max[0][0]:
            min_count = min_max[1][0]
            max_count = min_max[1][1]
            break

    normalized_count = (item[2] - min_count) / (max_count - min_count)
    print(f"count:{item[2]} | normalized_count:{normalized_count}")

    cursor.execute(
        f"UPDATE connection  SET ratio = {normalized_count*10000} WHERE target_tag = '{item[0]}' AND connect_tag = '{item[1]}'"
    )
    conn.commit()

# 変更をコミット

# 接続を閉じる
conn.close()
