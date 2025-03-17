from flask import Flask,request, send_file, jsonify
from flask_cors import CORS
import os
import atexit

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "capstone-project-2025-t1-25t1-3900-f11b-apple\\Statsplainer\\frontend\\src\\assets"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/upload-PDF", methods=["POST"])
def upload_pdf():
    if "file" not in request.files:
        return jsonify({"error": "No PDF uploaded"}), 400
    
    file = request.files["file"]
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)
    
    return jsonify({"message": "File uploaded successfully", "filename": file.filename})

@app.route("/get-pdf/<filename>", methods=["GET"])
def get_pdf(filename):
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    
    if not os.path.exists(file_path):
        return jsonify({"error": "PDF not found"}), 404
    
    return send_file(file_path, mimetype="application/pdf")

def cleanup():
    for pdf in os.listdir(UPLOAD_FOLDER):
        file_path = os.path.join(UPLOAD_FOLDER, pdf)
        os.remove(file_path)
        print(f"PDF deleted: {file_path}")

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
    
atexit.register(cleanup)