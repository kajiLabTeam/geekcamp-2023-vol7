import csv

from model.article import Article


def insert_article():
    with open("./init/data/article.csv", "r", encoding="utf-8") as file:
        reader = csv.reader(file)
        next(reader)
        for row in reader:
            id = int(row[0])
            article_text = row[1]
            last_update = row[2]

            article = Article(id=id, article=article_text, last_update=last_update)
            Article.insert_article(article)
