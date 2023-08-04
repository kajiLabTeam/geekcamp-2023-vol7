# 技育キャンプ 2023 vol.7

## バックエンド

### 実行方法

1. ディレクトリを移動

```shell
cd backend/build
```

2. MySQL と Python コンテナを建てる

```
docker compose up
```

3. ブラウザで以下の URL にアクセス

```
localhost:80
```

4. sample.http で API の動作確認を行ってみてください

### MySQL のデータを確認したいとき

1. MySQL コンテナにある MySQL サーバーにログイン

```shell
bash bin/connect_mysql.sh
```

2. DB にテーブルが挿入されているか確認

```shell
use wisdomtree;
```

```shell
show tables;
```

```shell
select * from article;
```

### コンテナ立ち上げ時にエラーが発生したとき

Dokcer 環境を初期化してください

```shell
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)

docker network prune -f
docker rmi -f $(docker images --filter dangling=true -qa)
docker volume rm $(docker volume ls --filter dangling=true -q)
docker rmi -f $(docker images -qa)
```
