import sqlite3

DB_NAME = "write.db"

conn_write = sqlite3.connect(DB_NAME)
cur_write = conn_write.cursor()

before= "express"
after = "Express"
# ids = [199,2490]


# for id in ids:
#     cur_write.execute("DELETE FROM article WHERE id = ?", (id,))
#     conn_write.commit()


# # nodeからnode_nameのbeforeを削除
# cur_write.execute("DELETE FROM node WHERE node_name = ?", (before,))
# conn_write.commit()

# # connection,articleも同様に
# cur_write.execute("UPDATE connection SET node_name = ? WHERE node_name = ?", (after,before,))
# conn_write.commit()

# # connection,articleも同様に
# cur_write.execute("UPDATE connection SET connect_node = ? WHERE node_name = ?", (after,before,))
# conn_write.commit()

# # connection,articleも同様に
# cur_write.execute("UPDATE article SET node_name = ? WHERE node_name = ?", (after,before,))
# conn_write.commit()
