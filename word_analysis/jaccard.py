from pathlib import Path
import re
import collections
import pandas as pd
import MeCab
import neologdn
import urllib
import unicodedata
import itertools
import networkx as nx
import pandas as pd
import csv

result_dir_path = Path('result')

if not result_dir_path.exists():
    result_dir_path.mkdir(parents=True)

def get_stopword_lsit(write_file_path):
    write_file_path = Path(write_file_path)

    if not write_file_path.exists():
        url = 'http://svn.sourceforge.jp/svnroot/slothlib/CSharp/Version1/SlothLib/NLP/Filter/StopWord/word/Japanese.txt'
        urllib.request.urlretrieve(url, write_file_path)

    with open(write_file_path, 'r', encoding='utf-8') as file:
        stopword_list = [word.replace('\n', '') for word in file.readlines()]

    return stopword_list

def get_noun_words_from_sentence(sentence, mecab, stopword_list=[]):
    return [
        x.split('\t')[0] for x in mecab.parse(sentence).split('\n') if len(x.split('\t')) > 1 and \
         '名詞' in x.split('\t')[3] and x.split('\t')[0] not in stopword_list
    ]

def split_sentence(sentence, mecab, stopword_list):
    sentence = neologdn.normalize(sentence)
    sentence = unicodedata.normalize("NFKC", sentence)
    words = get_noun_words_from_sentence(
        sentence=sentence, mecab=mecab, stopword_list=stopword_list
    )
    words = list(map(lambda x: re.sub(r'\d+\.*\d*', '0', x.lower()), words))
    return words

def make_jaccard_coef_data(combination_sentences):

    combi_count = collections.Counter(combination_sentences)

    word_associates = []
    for key, value in combi_count.items():
        word_associates.append([key[0], key[1], value])

    word_associates = pd.DataFrame(word_associates, columns=['word1', 'word2', 'intersection_count'])

    words = []
    for combi in combination_sentences:
        words.extend(combi)

    word_count = collections.Counter(words)
    word_count = [[key, value] for key, value in word_count.items()]
    word_count = pd.DataFrame(word_count, columns=['word', 'count'])

    word_associates = pd.merge(
        word_associates,
        word_count.rename(columns={'word': 'word1'}),
        on='word1', how='left'
    ).rename(columns={'count': 'count1'}).merge(
        word_count.rename(columns={'word': 'word2'}),
        on='word2', how='left'
    ).rename(columns={'count': 'count2'}).assign(
        union_count=lambda x: x.count1 + x.count2 - x.intersection_count
    ).assign(jaccard_coef=lambda x: x.intersection_count / x.union_count).sort_values(
        ['jaccard_coef', 'intersection_count'], ascending=[False, False]
    )
    
    return word_associates


# data/tags.csvからタグを取得
all_tags = pd.read_csv('data/tags.csv', header=None)[0].values.tolist()
# all_tags から 前48個を消す
tags = all_tags
# tags = ['Python', 'javascript']

for tag in tags:

    with open(f'data/qiita_{tag}.txt', 'r', encoding='utf-8') as file:
        lines = file.readlines()
        
    sentences = []
    for sentence in lines:
        texts = sentence.split('。')
        sentences.extend(texts)

    mecab = MeCab.Tagger('-Ochasen')

    stopword_list = []
    stopword_list = get_stopword_lsit('stopwords/stopword_list.txt')

    noun_sentences = []
    for sentence in sentences:
        noun_sentences.append(
            split_sentence(sentence=sentence, mecab=mecab, stopword_list=stopword_list)
        )

    noun_sentences = list(filter(lambda x: len(x) > 1 and '見出し' not in x, noun_sentences))

    combination_sentences = []
    combination_sentences = [list(itertools.combinations(words, 2)) for words in noun_sentences]
    combination_sentences = [[tuple(sorted(combi)) for combi in combinations] for combinations in combination_sentences]
    tmp = []
    for combinations in combination_sentences:
        tmp.extend(combinations)
    combination_sentences = tmp

    # 初期化
    jaccard_coef_data = pd.DataFrame(columns=['word1', 'word2', 'intersection_count', 'count1', 'count2', 'union_count', 'jaccard_coef'])
    output_jaccard_coef_data = pd.DataFrame(columns=['word1', 'word2', 'jaccard_coef'])
    output_jaccard_coef_data2 = pd.DataFrame(columns=['word1', 'word2', 'jaccard_coef'])
    jaccard_coef_data = make_jaccard_coef_data(combination_sentences)
    # Python , javascript , 0.5 を追加
    # new_row = {'word1': 'Python', 'word2': 'javascript', 'jaccard_coef': 0.5}
    # jaccard_coef_data.loc[len(jaccard_coef_data)] = new_row
    # jaccard_coef_dataからintersection_count,count1,count2,union_countの行を消す
    jaccard_coef_data = jaccard_coef_data.drop(['intersection_count', 'count1', 'count2', 'union_count'], axis=1)
    # Jaccard係数をtagsにあるものを抽出
    output_jaccard_coef_data = pd.DataFrame(columns=['word1', 'word2', 'jaccard_coef'])
    output_jaccard_coef_data = pd.concat([output_jaccard_coef_data, jaccard_coef_data[jaccard_coef_data['word1'].isin(all_tags)]])
    output_jaccard_coef_data2 = pd.concat([output_jaccard_coef_data2, output_jaccard_coef_data[output_jaccard_coef_data['word2'].isin(tags)]])
    # word1とword2が同じものを消す
    output_jaccard_coef_data2 = output_jaccard_coef_data2[output_jaccard_coef_data2['word1'] != output_jaccard_coef_data2['word2']]
    # print(output_jaccard_coef_data)
    # output_jaccard_coef_dataをcsvファイルとして出力
    output_jaccard_coef_data2.to_csv(f'result/test/jaccard_coef_data_{tag}.csv', index=False)

