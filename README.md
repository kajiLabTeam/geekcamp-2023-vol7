# 技育キャンプ 2023 vol.7

## バックエンド

### 実行方法

#### MySQL サーバーを建てる

1. ディレクトリを移動

```
cd backend/db
```

2. MySQL サーバーを建てる

```
docker compose up -d
```

3. MySQL コンテナにある MySQL サーバーにログイン

```
bash bin/connect_mysql.sh
```

4. DB にテーブルが挿入されているか確認
```
use wisdomtree;
```

```
show tables;
```

```
select * from article;
```

#### もしサーバーを立て、テーブルが作られていなかった時
Dokcer環境を初期化してください
```
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)

docker network prune -f
docker rmi -f $(docker images --filter dangling=true -qa)
docker volume rm $(docker volume ls --filter dangling=true -q)
docker rmi -f $(docker images -qa)
```

#### FastAPI サーバーを建てる

1. ディレクトリを移動

```
cd backend/server
```

2. 必要モジュールのインストール

```
pipenv install
```

3. 仮想環境に入る

```
pipenv shell
```

4. FastAPI サーバーを建てる

```
uvicorn main:app --reload
```

### ディレクトリの説明
#### model
- データベースのテーブルの定義を記述する
- DBとの具体的なやり取りを行う (追加、更新、削除)

#### db
- modelで定義した関数を呼び出しながらフロントエンドが欲しい形にデータを整形する

#### router
- dbで定義した関数を呼び出しながら最終的にAPIとして出力するJSONを作成する

