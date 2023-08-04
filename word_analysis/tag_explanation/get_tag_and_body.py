import requests
import json
from time import sleep
import re
from dotenv import load_dotenv
import os
import itertools
import sqlite3

load_dotenv()

QIITA_TOKEN = os.getenv('QIITA_TOKEN')
URL = 'https://qiita.com/api/v2/items'
HEADERS = {
    "Authorization": "Bearer " + QIITA_TOKEN
}

conn = sqlite3.connect('tags.db')
cur = conn.cursor()

cur.execute('''
    CREATE TABLE IF NOT EXISTS tag(
        name STRING PRIMARY KEY,
        explanation STRING,
        body STRING
    )
''')
conn.commit()


def shape2text(text):
    # 正規表現パターン
    code_block_pattern = r"```[\s\S]*?```"
    link_pattern = r"!?\[.*?\]|\(.*?\)"
    htmltag_pattern = r"<.*?>"
    url_pattern = r"https?://([a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})([/\w.-]*)*/?"
    programs_pattern = r"~~~[\s\S]*?~~~"
    number_pattern = r"[0-9]+\. "

    # 正規表現で削除
    text = re.sub(code_block_pattern, "", text)
    text = re.sub(link_pattern, "", text)
    text = re.sub(htmltag_pattern, "", text)
    text = re.sub(url_pattern, "", text)
    text = re.sub(programs_pattern, "", text)
    text = re.sub(number_pattern, "", text)

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


def get_is_exists_tag(tag):
    cur.execute(f'SELECT * FROM tag WHERE name="{tag}"')
    res = cur.fetchone()
    return not res is None


def get_data(tags):
    if len(tags) == 0:
        return

    not_exist_tags = set()
    for tag in tags:
        params = {
            "page": 1,
            "per_page": 100,
            'query': f'tag:{tag}',
            'sort': 'stock',
        }
        response = requests.get(URL, params=params, headers=HEADERS)

        body = ''.join([article['body'] for article in response.json()])
        tags_list = [article['tags'] for article in response.json()]

        tagname_list = set()
        for article_tags in tags_list:
            tagname_list.update([tag_['name'] for tag_ in article_tags])

        for tag_name in tagname_list:
            if not get_is_exists_tag(tag_name):
                not_exist_tags.update([tag_name])
                cur.execute(
                    f'INSERT OR IGNORE INTO tag(name) VALUES("{tag_name}")')
                conn.commit()

        shaped_body = shape2text(body)
        print(f'{tag}: {shaped_body[:50]}')
        cur.execute(
            f'UPDATE tag SET body="{shaped_body}" WHERE name="{tag}"')

        sleep(2)

    get_data(list(not_exist_tags))


if __name__ == '__main__':
    get_data(['JavaScript'])
