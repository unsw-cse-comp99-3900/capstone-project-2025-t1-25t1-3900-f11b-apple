from flask import request, jsonify, Blueprint, current_app
import os
from API import API_text_input
from log_interface import log_insert
from ai_prompt_util import prompt_builder, ai_temperature_control
from util import extract_text_from_pdf, pass_to_google_forms

aiapi_routes = Blueprint("aiapi_routes", __name__)

# Endpoint for handling highlighted text explanations
@aiapi_routes.route("/explain-highlight", methods=["POST"])
def explain_highlight():
    user_id = request.cookies.get('user_id')
    if user_id == "null":
        user_id = "No user_id found."

    data = request.json
    if not data or "highlighted_text" not in data or "mode" not in data or "filename" not in data:
        return jsonify({"error": "Missing highlighted_text, mode, or filename in request"}), 400

    highlighted_text = data["highlighted_text"]
    mode = data["mode"]
    filename = data["filename"]
    image_base64 = data.get("image_base64")
    is_user_input = bool(data.get("is_user_input"))
    
    file_path = os.path.join(current_app.config['PDF_FOLDER'], filename)
    
    try:
        full_text = extract_text_from_pdf(file_path)
    except Exception as e:
        # Log the error e for debugging
        print(f"Error extracting PDF text: {e}")
        return jsonify({"error": "Failed to extract text from PDF"}), 500

    # Validate filename to prevent path traversal issues (basic example)
    if filename:
        if ".." in filename or filename.startswith("/"):
            return jsonify({"error": "Invalid filename"}), 400

        file_path = os.path.join(current_app.config['PDF_FOLDER'], filename)

        if not os.path.exists(file_path):
            return jsonify({"error": f"File not found: {filename}"}), 404

    # Tell the AI whether the query is a highlighted text or a user query
    if is_user_input:
        combined_text = f"""This query is related to the user input and thus there is no highlight text, 
                            replace all explainations for the highlighted text for this user query
                        """
    else:
        combined_text = f"""Highlighted Text:
                            '{highlighted_text}'
                        """

    if image_base64:
        combined_text += """This query is related to the image attached and thus there is no highlighted text, 
                            replace all explainations for the highlighted text for this image.\n"""

    # Determine the developer message based on the mode
    dev_msg = prompt_builder(mode)
    combined_text += dev_msg
    
    try:
        # Call API utility with combined text and mode-specific instructions
        # Pass image_base64 if it exists
        explanation = API_text_input(
            text=full_text, 
            dev_msg=combined_text, 
            image_base64=image_base64,
            temperature=ai_temperature_control(mode))
        print(explanation)

        log_insert(user_id, highlighted_text, explanation, mode, filename)
        pass_to_google_forms(user_id, highlighted_text, explanation, mode, filename)
        
        return jsonify({
            "explanation": explanation
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500