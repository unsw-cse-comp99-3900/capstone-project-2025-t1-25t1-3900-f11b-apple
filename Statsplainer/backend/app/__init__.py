from flask import Flask
from flask_cors import CORS
import os

def create_app():
    print("🚀 create_app() called")
    app = Flask(__name__)
    CORS(app)

    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

    app.config['IMG_FOLDER'] = os.path.join(base_dir, 'img_uploads')
    app.config['PDF_FOLDER'] = os.path.join(base_dir, 'pdf_uploads')

    os.makedirs(app.config['IMG_FOLDER'], exist_ok=True)
    os.makedirs(app.config['PDF_FOLDER'], exist_ok=True)

    from .img_routes import img_routes
    from .pdf_routes import pdf_routes
    from .aiapi_routes import aiapi_routes

    app.register_blueprint(img_routes)
    app.register_blueprint(pdf_routes)
    app.register_blueprint(aiapi_routes)

    return app