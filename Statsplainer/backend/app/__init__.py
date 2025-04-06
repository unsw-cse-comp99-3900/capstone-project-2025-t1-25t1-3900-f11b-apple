from flask import Flask
from flask_cors import CORS
import os

def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config['IMG_FOLDER'] = 'img_uploads'
    app.config['PDF_FOLDER'] = 'pdf_uploads'

    os.makedirs('pdf_uploads', exist_ok=True)
    os.makedirs('img_pdfs', exist_ok=True)

    from .img_routes import img_routes
    from .pdf_routes import pdf_routes
    from .aiapi_routes import aiapi_routes

    app.register_blueprint(img_routes)
    app.register_blueprint(pdf_routes)
    app.register_blueprint(aiapi_routes)

    return app