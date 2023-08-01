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
bash backend/db/bin/connect_mysql.sh
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