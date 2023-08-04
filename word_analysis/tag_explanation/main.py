import requests
import json
from time import sleep
from dotenv import load_dotenv
import os
import sqlite3

from get_tag_and_body import shape2text, get_is_exists_tag
from get_explanation import add_db_explanation, get_explanation_from_wiki

load_dotenv()

QIITA_TOKEN = os.getenv('QIITA_TOKEN')
URL = 'https://qiita.com/api/v2/items'
HEADERS = {
    "Authorization": "Bearer " + QIITA_TOKEN
}

conn = sqlite3.connect('explanation.db')
cur = conn.cursor()

cur.execute('''
    CREATE TABLE IF NOT EXISTS tag(
        name STRING PRIMARY KEY,
        explanation STRING,
        body STRING
    )
''')
conn.commit()


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
        explanation = get_explanation_from_wiki(tag)
        print(f'{tag} : {shaped_body[:50]}')
        if explanation is not None:
            print(f'{tag} : {explanation[:50]}')
        else:
            print(f'{tag} : None')

        try:
            cur.execute(
                f'UPDATE tag SET body="{shaped_body}", explanation="{explanation}" WHERE name="{tag}"')
        except:
            pass

        sleep(2)

    get_data(list(not_exist_tags))


if __name__ == '__main__':
    get_data(['Python'])
