import sqlite3

db = "test.db"
conn = sqlite3.connect(db)
cur = conn.cursor()

cur.execute("""CREATE TABLE table_a(name string, no_a integer, no_b integer)""")

cur.execute("""INSERT INTO table_a VALUES(?,?,?)""", ("banana", 55, 1))
cur.execute("""INSERT INTO table_a VALUES(?,?,?)""", ("grape", 65, 2))

cur.execute("""SELECT MAX(no_a) FROM table_a""")
i = cur.fetchone()[0]
print(i)

conn.commit()
conn.close()
