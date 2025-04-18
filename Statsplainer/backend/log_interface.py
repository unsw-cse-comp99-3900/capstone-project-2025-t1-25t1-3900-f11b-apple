import sqlite3 as sq

log_path = "app_log.db"

def log_init():
    con = sq.connect(log_path)
    cur = con.cursor()

    cur.execute("CREATE TABLE IF NOT EXISTS log(browser_uid, user_provided_text, app_response, mode, uploaded_pdf)")

    con.commit()
    con.close()

def log_clear():
    con = sq.connect(log_path)
    cur = con.cursor()
    
    cur.execute("DROP TABLE IF EXISTS log")

    con.commit()
    con.close()

def log_insert(browser_uid, user_provided_text, app_response, mode, uploaded_pdf):
    con = sq.connect(log_path)
    cur = con.cursor()

    statement = """INSERT INTO log (browser_uid, user_provided_text, app_response, mode, uploaded_pdf) 
        VALUES (?, ?, ?, ?, ?)"""
    cur.execute(statement, (browser_uid, user_provided_text, app_response, mode, uploaded_pdf))
    
    con.commit()
    con.close()
