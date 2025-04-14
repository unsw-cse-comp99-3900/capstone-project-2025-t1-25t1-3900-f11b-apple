from app import create_app
from log_interface import execute_statement, init, clear
import os

app = create_app()

if __name__ == "__main__":
    
    # Create new database table for storing chat log
    execute_statement(clear())
    execute_statement(init())

    app.run(
        debug=True,
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5000))
    )
