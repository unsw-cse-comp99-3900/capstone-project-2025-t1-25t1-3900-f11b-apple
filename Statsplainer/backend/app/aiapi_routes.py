from flask import request, jsonify, Blueprint, current_app
import os
from API import API_text_input
from util import extract_text_from_pdf, prompt_builder
from datetime import datetime
from log_interface import execute_statement, insert_message

aiapi_routes = Blueprint("aiapi_routes", __name__)

# Endpoint for handling highlighted text explanations
@aiapi_routes.route("/explain-highlight", methods=["POST"])
def explain_highlight():
    data = request.json
    if not data or "highlighted_text" not in data or "mode" not in data or "filename" not in data:
        return jsonify({"error": "Missing highlighted_text, mode, or filename in request"}), 400
    
    highlighted_text = data["highlighted_text"]
    mode = data["mode"]
    filename = data["filename"]
    image_base64 = data.get("image_base64")

    # Validate filename to prevent path traversal issues (basic example)
    if filename:
        if ".." in filename or filename.startswith("/"):
            return jsonify({"error": "Invalid filename"}), 400

        file_path = os.path.join(current_app.config['PDF_FOLDER'], filename)

        if not os.path.exists(file_path):
            return jsonify({"error": f"File not found: {filename}"}), 404
            
    try:
        full_text = extract_text_from_pdf(file_path)
    except Exception as e:
        # Log the error e for debugging
        print(f"Error extracting PDF text: {e}")
        return jsonify({"error": "Failed to extract text from PDF"}), 500

    # Combine highlighted text and context for the API
    combined_text = f"""Highlighted Text (If the highlighted text is not part of the pdf then it is a user enquiry):
                        '{highlighted_text}'
                        Full Context from PDF:
                        {full_text}
                    """

    if image_base64:
        combined_text += """This query is related to the image attached and thus there is no highlighted text, 
                            replace all explainations for the highlighted text for this image.\n"""

    # Determine the developer message based on the mode
    dev_msg = prompt_builder(mode)
    
    try:
        # Call API utility with combined text and mode-specific instructions
        # Pass image_base64 if it exists
        explanation = API_text_input(text=combined_text, dev_msg=dev_msg, image_base64=image_base64)
        print(explanation)
        session_id = "placeholder_id"
        message = explanation
        sender = "Statsplainer"
        dt = datetime.now()
        ts = datetime.timestamp(dt)
        execute_statement(insert_message(session_id, message, sender, dt, ts))
        return jsonify({
            "explanation": explanation
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
