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
        dev_msg = """
                    Explain the 'Highlighted Text' using the 'Full Context from PDF'.
                    Your explanation must:
                    1. If the highlighted text isnt a text from the document treat it as a quesiton or enquiry from the user.
                    2. Explicitly reference what specific entities or values the highlighted text refers to in the surrounding context (e.g., if "8%" is highlighted, explain exactly what this percentage represents based on the context).
                    3. If statistics are highlighted focus on explaining what these statistics mean including their implications and significance (e.g if P values are said explain in a short sentence what a P value is then continue on with explaining the implications and significance of the statistucs).
                    4. Include critical context from surrounding paragraphs needed to fully understand the highlighted text.
                    5. Be concise (under 150 words) but complete.
                    6. Use clear, precise language.
                    7. Prioritize explaining references, relationships, and what exactly the highlighted text represents within the provided context.
                    8. If the highlighted text contains statistics, percentages, or measurements, always specify what they measure or refer to according to the context.
                    9. If the user asks a question do not state that the user's question is a highlighted text in your response and answer the user's enquiry in regards to their previously highlighted sections.
                """
    elif mode == "ELI5":
        dev_msg = """
                    Your explaination must:
                    1. Explain the 'Highlighted Text' in very simple terms, like you're talking to a five-year-old, using the 'Full Context from PDF' to understand what the text means, this also applies for the other instructions below.
                    2. If statistics are highlighted focus on explaining what these statistics mean including their implications and significance such that a five-year-old can understand them.
                """
    elif mode == "Real world analogy":
        dev_msg = """
                    Your explaination must:
                    1. Provide a real-world analogy to help understand the concept presented in the 'Highlighted Text', using the 'Full Context from PDF' to understand the concept. This also applies for the other instructions below.
                    2. If statistics are highlighted focus on explaining what these statistics mean including their implications and significance using real-world analogies.
                    3. If any statistical jargon for example like P values are said explain in a short sentence what a P value is then continue on with explaining like step 2
                """
    else:
        # Default to definition if mode is unknown or invalid
        dev_msg = """
                    Your explaination must:
                    1. Explain the 'Highlighted Text' using the 'Full Context from PDF'.
                    2. If statistics are highlighted focus on explaining what these statistics mean including their implications and significance (e.g if P values are said explain in a short sentence what a P value is then continue on with explaining the implications and significance of the statistucs).
                """
    
    try:
        # Call API utility with combined text and mode-specific instructions
        explanation = API_text_input(text=combined_text, dev_msg=dev_msg)
        print(explanation)
        return jsonify({
            "explanation": explanation
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
