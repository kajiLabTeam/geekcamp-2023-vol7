import requests
import json
from time import sleep
import sqlite3

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

URL = "https://ja.wikipedia.org/w/api.php"
params = {
    "action": "query",
    "format": "json",
    "prop": "extracts",
    "exintro": "",
    "explaintext": "",
    "redirects": "1",
}


def get_explanation_from_wiki(title):
    params["titles"] = title
    response = requests.get(URL, params=params)
    data = response.json()

    if "pages" not in data["query"]:
        return "404"

    page = data["query"]["pages"]
    page_id = list(page.keys())[0]

    if "extract" not in page[page_id]:
        return "404"

    explanation = page[page_id]["extract"]
    return explanation


def add_db_explanation(title, explanation):
    try:
        cur.execute(
            f'UPDATE tag SET explanation="{explanation}" WHERE name="{title}"')
    except:
        pass


if __name__ == '__main__':
    cur.execute('SELECT name FROM tag WHERE explanation IS NULL')
    tags = [tag[0] for tag in cur.fetchall()]

    for tag in tags:
        explanation = get_explanation_from_wiki(tag)
        print(f'{tag} : {explanation[:50]}')
        sleep(2)
        if explanation is not None:
            add_db_explanation(tag, explanation)
