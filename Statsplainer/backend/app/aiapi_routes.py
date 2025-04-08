from flask import request, jsonify, Blueprint, current_app
import os
from API import API_text_input
from util import extract_text_from_pdf

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

    # Validate filename to prevent path traversal issues (basic example)
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
    combined_text = f"""Highlighted Text:
'{highlighted_text}'

Full Context from PDF:
{full_text}
"""

    # Determine the developer message based on the mode
    if mode == "Definition":
        dev_msg = """Explain the 'Highlighted Text' using the 'Full Context from PDF'.
Your explanation must:
1. Explicitly reference what specific entities or values the highlighted text refers to in the surrounding context (e.g., if "8%" is highlighted, explain exactly what this percentage represents based on the context).
2. Include critical context from surrounding paragraphs needed to fully understand the highlighted text.
3. Be concise (under 150 words) but complete.
4. Use clear, precise language.
5. Prioritize explaining references, relationships, and what exactly the highlighted text represents within the provided context.
6. If the highlighted text contains statistics, percentages, or measurements, always specify what they measure or refer to according to the context."""
    elif mode == "ELI5":
        dev_msg = "Explain the 'Highlighted Text' in very simple terms, like you're talking to a five-year-old, using the 'Full Context from PDF' to understand what the text means."
    elif mode == "Real world analogy":
        dev_msg = "Provide a real-world analogy to help understand the concept presented in the 'Highlighted Text', using the 'Full Context from PDF' to understand the concept."
    else:
        # Default to definition if mode is unknown or invalid
        dev_msg = "Explain the 'Highlighted Text' using the 'Full Context from PDF'."
    
    try:
        # Call API utility with combined text and mode-specific instructions
        explanation = API_text_input(text=combined_text, dev_msg=dev_msg)
        print(explanation)
        return jsonify({
            "explanation": explanation
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
