import sqlite3
import datetime

# 書き込み先のDBの読み込み
WRITE_DB_PATH = 'write.db'
conn_write = sqlite3.connect(WRITE_DB_PATH)
cur_write = conn_write.cursor()

# 読み込み先のDBの読み込み
READ_DB_PATH = 'read.db'
conn_read = sqlite3.connect(READ_DB_PATH)
cur_read = conn_read.cursor()

# 今日の日付を取得
today = datetime.date.today()
today = today.strftime('%Y.%m.%d')

# nodeテーブルに単語を追加
def add_db(word):
    cur_write.execute('INSERT INTO node(node_name, items_count) VALUES(?, ?)', (word, 5000))
    conn_write.commit()
    return

# conntectionテーブルに単語を追加
def add_db2(word1,word2):
    cur_write.execute('INSERT INTO connection(node_name, connect_node, strength) VALUES(?, ?, ?)', (word1, word2, 50))
    conn_write.commit()
    return

# articleテーブルに単語を追加
def add_db3(word,article):
    cur_write.execute('INSERT INTO article(node_name, article,last_update) VALUES(?, ?, ?)', (word, article, today))
    conn_write.commit()
    return

# node,connection,articleテーブルを読み出して、書き込み先のDBに書き込む
# ReadのnodeとWriteのnode_nameが同一のものは書きこまない
cur_read.execute('SELECT * FROM node')
for row in cur_read:
    # nodeがnode_nameに存在しない場合のみ書き込み
    cur_write.execute('SELECT * FROM node WHERE node_name=?', (row[1],))
    if cur_write.fetchone() is None:
        add_db(row[1])
        print(f"{row[1]} is collect / node")
cur_read.execute('SELECT * FROM connection')
for row in cur_read:
    # parentがnode_name,childrenがconnect_nodeに存在しない場合のみ書き込み
    cur_write.execute('SELECT * FROM connection WHERE node_name=?', (row[1],))
    if cur_write.fetchone() is None:
        add_db2(row[1],row[2])
        print(f"{row[1]} is collect / connection")
cur_read.execute('SELECT * FROM article')
for row in cur_read:
    # nodeがnode_nameに存在しない場合のみ書き込み
    cur_write.execute('SELECT * FROM article WHERE node_name=?', (row[1],))
    if cur_write.fetchone() is None:
        add_db3(row[1],row[2])
        print(f"{row[1]} is collect / article")

conn_read.close()
conn_write.close()

