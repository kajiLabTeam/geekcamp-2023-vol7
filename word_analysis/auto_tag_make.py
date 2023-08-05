import sys
import collections
from janome.tokenizer import Tokenizer
import pytermextract.termextract.janome
import pytermextract.termextract.core
import requests
from bs4 import BeautifulSoup
import pandas as pd
import re

# 自動生成した全タグ情報
all_tags = []
url = "https://qiita.com/fukumasa/items/884eadd2694de19d64ff"

"""
Qiitaの記事からタグを自動生成する
"""


def createTags(text):
    # Qiitaの記事から専門用語を抽出
    t = Tokenizer()
    tokenize_text = t.tokenize(text)
    frequency = pytermextract.termextract.janome.cmp_noun_dict(tokenize_text)
    lr = pytermextract.termextract.core.score_lr(
        frequency,
        ignore_words=pytermextract.termextract.janome.IGNORE_WORDS,
        lr_mode=1,
        average_rate=1,
    )
    data = pytermextract.termextract.core.term_importance(frequency, lr)
    data_collection = collections.Counter(data)

    # 抽出した専門用語を1つずつ取得
    for cmp_noun, value in data_collection.most_common():
        word = pytermextract.termextract.core.modify_agglutinative_lang(
            cmp_noun
        ).lower()

        # Qiitaに登録済みのタグか確認
        res = pd.read_csv("data/qiita_tags.csv")

        # Qiitaに登録済みのタグのみに絞る
        if not res.empty:
            tag = {}
            tag["name"] = word
            tag["value"] = value
            tag["followers"] = res.iloc[0, 1]  # DataFrameの特定のセルを指定して値を取得
            tag["items"] = res.iloc[0, 2]
            all_tags.append(tag)

    return all_tags


"""
Qiitaの記事から内容を抽出する
"""


def extractText(qiita_tag):
    host = "https://qiita.com/api/v2/items"
    QIITA_TOKEN = "344527117a43d771303f2cb7a6a352e14ecb45fc"
    host = "https://qiita.com/api/v2/items"
    headers = {"Authorization": "Bearer " + QIITA_TOKEN}
    params = {
        "page": 1,
        "per_page": 100,
        "query": f"tag:{qiita_tag}",
        "sort": "stock",
    }
    text = ""

    response = requests.get(host, params=params, headers=headers)
    body = "".join([article["rendered_body"] for article in response.json()])
    # bodyの一部を置き換える
    body.replace("'", "").replace('"', "").replace("\n", "").replace(
        "\r\n", ""
    ).replace("\u003c", "<").replace("\u003e", ">").replace("\u003d", "=")

    # body を BeautifulSoup でパース
    soup = BeautifulSoup(body, "html.parser")

    # プログラムのコードは除去
    for tag in soup.find_all("div", {"class": "code-frame"}):
        tag.decompose()

    # imgタグは除去
    for tag in soup.find_all("img"):
        tag.decompose()

    # 全てのタグの中身を取得する
    for tag in soup.find_all():
        text += tag.text

    return text


"""
Qiitaの記事から現在登録されているタグを抽出する
"""


def extractTags(url):
    r = requests.get(url)
    soup = BeautifulSoup(r.text, "lxml")
    # all_tags = []
    # 生成したタグ情報よりタグ名のリストを取得
    t_name = [t.get("name") for t in all_tags]

    # Qiitaの記事に現在登録されているタグを取得
    for keyword in (
        soup.find("meta", attrs={"name": "keywords"}).get("content").split(",")
    ):
        # タグの情報を取得
        keyword = keyword.lower()
        res = pd.read_csv("data/qiita_tags.csv")

        if not res.empty:
            followers = int(res.iloc[0, 1])
            items = int(res.iloc[0, 2])
        else:
            followers = 0
            items = 0

        if keyword in t_name:
            value = all_tags[t_name.index(keyword)]["value"]
        else:
            value = 0

        tag = {}
        tag["name"] = keyword
        tag["value"] = value
        tag["followers"] = followers  # DataFrameの特定のセルを指定して値を取得
        tag["items"] = items
        all_tags.append(tag)

    return all_tags


if __name__ == "__main__":
    # qiita_tags配列にqiita_tags.csvの内容を格納
    qiita_tags = pd.read_csv("data/qiita_tags.csv")
    # qiita_tagsから漢字を含むタグを消す
    for tag in qiita_tags:
        if re.search("[\u4e00-\u9FFF]", tag):
            qiita_tags.remove(tag)

    # qiita_tags = ["aws"]
    for qiita_tag in qiita_tags["id"]:
        # for qiita_tag in qiita_tags:
        print("■タグ名：" + qiita_tag)
        text = ""
        tags = []
        text = extractText(qiita_tag)
        all_tags = []
        all_tags = createTags(text)
        all_qiita_tags = []

        important_tags = []
        follower_tags = []
        registration_tags = []

        # print("■自動生成したタグ情報（重要度順 TOP5）")
        important_tags = sorted(
            all_tags, key=lambda tag: tag["value"], reverse=True
        )  # [0:300]
        # for tag in important_tags:
        #     print(tag)
        # print("------------------------------------")
        # print("■自動生成したタグ情報（フォロワー数順 TOP5）")
        follower_tags = sorted(
            all_tags, key=lambda tag: tag["followers"], reverse=True
        )  # [0:300]
        # for tag in follower_tags:
        #     print(tag)
        # print("------------------------------------")
        # print("■自動生成したタグ情報（記事登録数順 TOP5）")
        registration_tags = sorted(
            all_tags, key=lambda tag: tag["items"], reverse=True
        )  # [0:300]
        # for tag in registration_tags:
        #     print(tag)
        # print("------------------------------------")
        # print("■現在登録されているタグ情報")
        tags = extractTags(url)
        # for tag in tags:
        #     print(tag)

        # 4つのtagsを比較して、一つにまとめる
        # all_qiita_tags.extend(tags)
        all_qiita_tags.extend(important_tags)
        all_qiita_tags.extend(follower_tags)
        all_qiita_tags.extend(registration_tags)
        # all_qiita_tags['name']の重複を削除する
        all_qiita_tags = [dict(t) for t in {tuple(d.items()) for d in all_qiita_tags}]
        # 正規表現で漢字を含む要素は削除する
        all_qiita_tags = [
            tag for tag in all_qiita_tags if not re.search(r"[一-龥]", tag["name"])
        ]
        # 日本語を含む要素は削除する
        all_qiita_tags = [
            tag for tag in all_qiita_tags if not re.search(r"[ぁ-ん]", tag["name"])
        ]
        # {,},[,],(,),",',httpを含む要素は削除する
        all_qiita_tags = [
            tag
            for tag in all_qiita_tags
            if not re.search(
                r"[{,},[,\],(,),\",//,|,–,~,ﾎﾞｿｯ,パワフル,ズレ,ポ,メモ,デモ,ノウハウ,yyyy,mm,dd,⇔,ツケｃ, ,ﾆｬｰ,ネタ,❷,❸,⑥,⭕,≒,⇒,¥,│,≥,☟,ﾊﾟﾁﾊﾟﾁ,ｄ,°,',$,\\,_,♪,...,-,？,>,<,*,#,`,?,テトリス,▫,　,⚫,^,「,」,（,）,=,↩,③,①,②,④,⑤,in,on,of,before,for,→,↑,←,↓,ー,http,ドキドキ,オマエ,アイコ,～,バカ,▶,ペンギン,@,≤,------------,ボブ,!,…,グラッチェ,シュシュシュシュシュシュシュシュシュシュシュシュシュシュショ,サクッ,ラク,ググ,⬜,—,ゴロ,！]",
                tag["name"],
            )
        ]
        # 一文字だけのアルファベットは削除する
        all_qiita_tags = [
            tag for tag in all_qiita_tags if not re.search(r"^[a-zA-Z]$", tag["name"])
        ]

        # tagsをcsvに保存する
        df = pd.DataFrame(all_qiita_tags)
        df.to_csv(f"data/qiita_tags_another/{qiita_tag}.csv", index=False)
