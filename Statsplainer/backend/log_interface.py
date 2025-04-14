import sqlite3 as sq

log_path = "app_log.db"

def log_init():
    con = sq.connect(log_path)
    cur = con.cursor()

    cur.execute("CREATE TABLE IF NOT EXISTS log(session_id, message, sender)")

    con.commit()
    con.close()

def log_clear():
    con = sq.connect(log_path)
    cur = con.cursor()
    
    cur.execute("DROP TABLE IF EXISTS log")

    con.commit()
    con.close()

def log_insert(session_id, message, sender):
    con = sq.connect(log_path)
    cur = con.cursor()

    statement = """INSERT INTO log (session_id, message, sender) 
        VALUES (?, ?, ?)"""
    cur.execute(statement, (session_id, message, sender))
    
    con.commit()
    con.close()
