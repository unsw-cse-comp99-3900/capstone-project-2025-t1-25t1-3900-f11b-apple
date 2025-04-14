import sqlite3 as sq

log_path = "app_log.db"

def execute_statement(statement):
    con = sq.connect(log_path)
    cur = con.cursor()
    cur.execute(statement)
    con.commit()
    con.close()

def init():
    return "CREATE TABLE IF NOT EXISTS log(session_ID, sender, message, datetime, timestamp)"

def clear():
    return "DROP TABLE IF EXISTS log"

def insert_message(session_id, sender, message, datetime, timestamp):
    return f"""
        INSERT INTO log VALUES
            ({session_id}, {sender}, {message}, {datetime}, {timestamp})
    """

""" Returns chat log 
    - session_id: specifies session_id for which chat log belongs to
    - mode: specifies mode for which chat log belongs to
"""
def get_messages():
    return """
        SELECT sender, message, time
        FROM log 
        ODER BY time DESC
    """
