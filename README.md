# 技育キャンプ 2023 vol.7

## バックエンド

### 実行方法

#### MySQL サーバーを建てる

1. ディレクトリを移動

```shell
cd backend/db
```

2. MySQL サーバーを建てる

```shell
docker compose up -d
```

3. MySQL コンテナにある MySQL サーバーにログイン

```shell
bash bin/connect_mysql.sh
```

4. DB にテーブルが挿入されているか確認

```shell
use wisdomtree;
```

```shell
show tables;
```

```shell
select * from article;
```

#### もしサーバーを立て、テーブルが作られていなかった時

Dokcer 環境を初期化してください

```shell
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)

docker network prune -f
docker rmi -f $(docker images --filter dangling=true -qa)
docker volume rm $(docker volume ls --filter dangling=true -q)
docker rmi -f $(docker images -qa)
```

#### FastAPI サーバーを建てる

1. ディレクトリを移動

```shell
cd backend/server
```

2. 必要モジュールのインストール

```shell
pipenv install
```

3. 仮想環境に入る

```shell
pipenv shell
```

4. FastAPI サーバーを建てる

```shell
uvicorn main:app --reload
```

### ディレクトリの説明

#### model

- データベースのテーブルの定義を記述する
- DB との具体的なやり取りを行う (追加、更新、削除)

#### db

- model で定義した関数を呼び出しながらフロントエンドが欲しい形にデータを整形する

#### router

- db で定義した関数を呼び出しながら最終的に API として出力する JSON を作成する

## word_analysis で使用しているモジュールについて

[自動抽出 Python モジュール termextract](http://gensen.dl.itc.u-tokyo.ac.jp/pytermextract/)

上記の URL よりダウンロードして解凍してください

### その後のセットアップ

```
$ pip install .
$ pip install janome
$ pip install nltk
$ pip install pynlpir
```

```
$ python setup.py install
```

```
$ sudo python -m nltk.downloader -d /usr/local/share/nltk_data all
```
