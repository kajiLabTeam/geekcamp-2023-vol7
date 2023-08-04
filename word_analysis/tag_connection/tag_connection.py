import requests
import json
from time import sleep
from dotenv import load_dotenv
import os
import sqlite3

load_dotenv()

QIITA_TOKEN = os.getenv('QIITA_TOKEN')
URL = 'https://qiita.com/api/v2'
HEADERS = {
    "Authorization": f"Bearer {QIITA_TOKEN}"
}

conn = sqlite3.connect('connection.db')
cur = conn.cursor()

cur.execute('''
    CREATE TABLE IF NOT EXISTS connection(
        target_tag TEXT,
        connect_tag TEXT,
        count INTEGER
    )
''')
cur.execute('''
    CREATE TABLE IF NOT EXISTS tags(
        tag TEXT PRIMARY KEY,
        followers_count INTEGER,
        items_count INTEGER,
        page INTEGER,
        icon_url TEXT
    )
''')
conn.commit()


# pageが最小かつitems_countが指定した値以上かつitems_countが最大のタグを取得
def get_next_tag(min_items_count=486):
    sql = f'''
        SELECT tag, page, items_count
        FROM tags
        WHERE items_count > {min_items_count}
        ORDER BY page ASC, items_count DESC LIMIT 1
    '''

    cur.execute(sql)
    res = cur.fetchone()
    tag = res[0]
    page = res[1]
    items_count = res[2]

    return (tag, page+1, items_count)


# 指定したtagのpageを1増やす
def pls_one_page(tag):
    cur.execute(f'''
        UPDATE tags
        SET page=page+1
        WHERE tag="{tag}"
    ''')
    conn.commit()


# tag同士の関連性をカウントしてDBに保存
def tag_connect_counter(article_tags, target_tag):
    for tags in article_tags:
        tags_ = [t['name']for t in tags if t['name'] != target_tag]
        print(tags_)

        for tag in tags_:
            cur.execute(f'''
                SELECT * FROM connection
                WHERE target_tag="{target_tag}"
                    AND connect_tag="{tag}"
            ''')
            is_exist = cur.fetchone()

            if is_exist:
                cur.execute(f'''
                    UPDATE connection
                    SET count=count+1
                    WHERE target_tag="{target_tag}"
                        AND connect_tag="{tag}"
                ''')
            else:
                cur.execute(f'''
                    INSERT INTO connection
                    VALUES("{target_tag}", "{tag}", 1)
                ''')
        conn.commit()


# Qiitaからtag同士の関連性を取得
def get_tag_connection(tag, page, items_count):
    print()
    print(f'----- {tag} -----')

    if items_count <= page * 100:
        print(f'記事数を上回っています. {items_count} >= {page * 100}')
        return

    params = {
        "page": page,
        "per_page": 100,
        'query': f'tag:{tag}',
        'sort': 'likes_count',
    }

    response = requests.get(f'{URL}/items', params=params, headers=HEADERS)
    tags_list = [article['tags'] for article in response.json()]
    tag_connect_counter(tags_list, tag)

    sleep(2)


# Qiitaからタグ一覧を取得してDBに保存
def get_tags():
    for i in range(1, 101):
        params = {
            "page": i,
            "per_page": 100,
            'sort': 'name',
        }
        response = requests.get(f'{URL}/tags', params=params, headers=HEADERS)

        for tag in response.json():
            print(tag['id'])
            cur.execute(f'''
                INSERT OR IGNORE INTO tags
                VALUES(
                    "{tag["id"]}",
                    {tag["followers_count"]},
                    {tag["items_count"]},
                    0,
                    "{tag["icon_url"]}")
            ''')

        conn.commit()
        sleep(2)


if __name__ == '__main__':
    # get_tags()
    while True:
        try:
            (next_tag, nest_page, items_count) = get_next_tag(486)
            pls_one_page(next_tag)
            get_tag_connection(next_tag, nest_page, items_count)
        except e:
            with open('./err.log', 'a') as f:
                f.write(e)
