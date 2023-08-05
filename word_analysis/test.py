import re
import pandas as pd

with open("data/qiita_tags.csv", "r") as f:
    qiita_tags = pd.read_csv(f)
# qiita_tagsから漢字を消す
for tag in qiita_tags:
    if re.search("[\u4e00-\u9FFF]", tag):
        qiita_tags.remove(tag)

print(qiita_tags)
