# カレントディレクトリ以下のdataディレクトリの中のtxtファイルの名前を取得
# qiita_{tag}.txtの形式で保存されている
# 例: qiita_python.txt
# {tag}の部分を取り出してcsvファイルの名前にする
# その際ファイルの大きさ順に並べる
# その際に200KB以下のファイルは除外する

import os
import csv
import pandas as pd

# ファイル名を解析してタグを取得する関数
def extract_tag(file_name):
    if file_name.startswith("qiita_") and file_name.endswith(".txt"):
        tag = file_name[len("qiita_"):-len(".txt")]
        return tag
    return None

# カレントディレクトリ以下のdataディレクトリ内のtxtファイルを取得
txt_files = [file for file in os.listdir("data") if file.endswith(".txt")]

# タグとファイルサイズの情報を取得
file_info = []
for txt_file in txt_files:
    file_path = os.path.join("data", txt_file)
    file_size = os.path.getsize(file_path)  # ファイルサイズを取得（バイト単位）
    
    if file_size <= 200 * 1024:  # ファイルサイズが200KB以下の場合は除外
        continue
    
    tag = extract_tag(txt_file)
    if tag:
        file_info.append((tag, file_size))

df = pd.DataFrame(file_info, columns=['tag', 'file_size'])
# file sizeの列でソート
df = df.sort_values('file_size', ascending=False)
# file_sizeの列を削除
df = df.drop(['file_size'], axis=1)

# csvファイルに書き込む カンマ区切り形式で
df.to_csv('data/tags.csv', index=False, header=False , sep=',')
