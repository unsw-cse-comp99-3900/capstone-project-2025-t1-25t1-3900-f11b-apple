from flask import request, send_file, jsonify, Blueprint, current_app
import os
from util import extract_text_from_pdf
from API import API_text_input

pdf_routes = Blueprint("pdf_routes", __name__)

@pdf_routes.route("/upload-PDF", methods=["POST"])
def upload_pdf():
    if "file" not in request.files:
        return jsonify({"error": "No PDF uploaded"}), 400
    
    file = request.files["file"]
    file_path = os.path.join(current_app.config['PDF_FOLDER'], file.filename)
    file.save(file_path)
    
    try:
        full_text = extract_text_from_pdf(file_path)
    except Exception as e:
        # Log the error e for debugging
        print(f"Error extracting PDF text: {e}")
        return jsonify({"error": "Failed to extract text from PDF"}), 500
    
    dev_msg = """
        This is the full PDF provided here for context, 
        use this PDF to answer all further queries.
        
        Here is a research article. Please extract:
        1. The topic and field of study
        2. The study's goal
        3. Key statistical findings (e.g., p-values, confidence intervals)
        4. Limitations or uncertainties
        
        Break the paper into:
        1. First page → infer title/authors
        2. Abstract
        3. Methods
        4. Results
        5. Discussion
    """
    
    try:
        # Call API utility with combined text and mode-specific instructions
        # Pass image_base64 if it exists
        explanation = API_text_input(text=full_text, dev_msg=dev_msg)
        print(explanation)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    return jsonify({"message": "File uploaded successfully", "filename": file.filename})

@pdf_routes.route("/get-pdf/<filename>", methods=["GET"])
def get_pdf(filename):
    file_path = os.path.join(current_app.config['PDF_FOLDER'], filename)
    
    if not os.path.exists(file_path):
        return jsonify({"error": "PDF not found"}), 404
    
    return send_file(file_path, mimetype="application/pdf")

def cleanup():
    for pdf in os.listdir(current_app.config['PDF_FOLDER']):
        file_path = os.path.join(current_app.config['PDF_FOLDER'], pdf)
        os.remove(file_path)
        print(f"PDF deleted: {file_path}")

