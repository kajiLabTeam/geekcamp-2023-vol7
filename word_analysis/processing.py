import requests
import json
from time import sleep
from bs4 import BeautifulSoup
import re
from dotenv import load_dotenv
import os
import itertools
import csv
import pandas as pd

load_dotenv()

def shape2text(markdown_text):

    # 正規表現パターン
    code_block_pattern = r"```[\s\S]*?```"
    code_block_pattern2 = r"!?\[.*?\]|\(.*?\)"
    code_block_pattern3 = r"<.*?>"
    code_block_pattern4 = r"https?://([a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})([/\w.-]*)*/?"
    code_block_pattern5 = r"~~~[\s\S]*?~~~"
    code_block_pattern6 = r"[0-9]+\. "


    # 正規表現で削除
    text = re.sub(code_block_pattern, "", markdown_text)
    text = re.sub(code_block_pattern2, "", text)
    text = re.sub(code_block_pattern3, "", text)
    text = re.sub(code_block_pattern4, "", text)
    text = re.sub(code_block_pattern5, "", text)
    text = re.sub(code_block_pattern6, "", text)


    shift_txt = "`%*:) 　-=><_＿「」『』〈〉《》〔〕【】|,'/・…→↓↑←⇒$^;ー：！※#"
    shift_txt_table = str.maketrans("", "", shift_txt)
    text = text.translate(shift_txt_table)
    
    # 文字列を削除
    cleaned_text = (
        text.replace("\\", "")
        .replace("\n", "")
        .replace("\r\n", "")
        .replace('"', "")
    )


    return cleaned_text

# ページの内容を取得
content = requests.get("https://qiita.com/tags").content
soup = BeautifulSoup(content, 'html.parser')
span_elements = soup.find_all('span', class_='style-vu72ne')

# tag一覧を取得
span_shift = r' （[\s\S]*?）'
tags = [re.sub(span_shift, '', s.text) for s in span_elements]

QIITA_TOKEN = os.getenv('QIITA_TOKEN')
host = 'https://qiita.com/api/v2/items'
headers = {
    "Authorization": "Bearer " + QIITA_TOKEN
}

without_tags = set()
for tag in tags:
    params = {
        "page": 1,
        "per_page": 100,
        'query': f'tag:{tag}',
        'sort': 'stock',
    }
    response = requests.get(host, params=params, headers=headers)

    body = ''.join([article['body'] for article in response.json()])
    tags_list = [article['tags'] for article in response.json()]

    tagname_list = set()
    for article_tags in tags_list:
        tagname_list.update([tag_['name'] for tag_ in article_tags])
    print(tagname_list)
    without_tags.update(tagname_list)

    with open(f'data/qiita_{tag}.txt', 'a') as f:
        f.write(shape2text(body) + '\n')

    sleep(2)

for tag in list(without_tags.difference(tags)):
    params = {
        "page": 1,
        "per_page": 100,
        'query': f'tag:{tag}',
        'sort': 'stock',
    }

    response = requests.get(host, params=params, headers=headers)
    body = ''.join([article['body'] for article in response.json()])

    with open(f'data/qiita_{tag}.txt', 'a') as f:
        f.write(shape2text(body) + '\n')

    sleep(2)

# without_tagsとtagsを合成
without_tags.update(tags)

# tagsをcsvで保存
df = pd.DataFrame(without_tags)
df.to_csv('data/tags.csv', index=False, header=False)
