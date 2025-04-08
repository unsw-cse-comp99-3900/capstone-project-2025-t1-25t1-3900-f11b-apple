from app import create_app
import os
import logging

app = create_app()

if __name__ == "__main__":
    #logging.basicConfig(level=logging.DEBUG)
    
    app.run(
        debug=True,
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5000))
    )