from flask import request, jsonify, Blueprint, current_app
import os
from API import API_text_input
from util import extract_text_from_pdf

aiapi_routes = Blueprint("aiapi_routes", __name__)

# Endpoint for handling highlighted text explanations
@aiapi_routes.route("/explain-highlight", methods=["POST"])
def explain_highlight():
    data = request.json
    if not data or "highlighted_text" not in data:
        return jsonify({"error": "No highlighted text provided"}), 400
    
    highlighted_text = data["highlighted_text"]
    
    filename = data["filename"]
    file_path = os.path.join(current_app.config['PDF_FOLDER'], filename)
    full_text = extract_text_from_pdf(file_path)
    
    
    prompt = f"""Explain this highlighted text in context: '{highlighted_text}'

            Your explanation must:
            1. Explicitly reference what specific entities or values the highlighted text refers to in the surrounding context (e.g., if "8%" is highlighted, explain exactly what this percentage represents)
            2. Include critical context from surrounding paragraphs needed to fully understand the highlighted text
            3. Be concise (under 150 words) but complete
            4. Use clear, precise language
            5. Prioritize explaining references, relationships, and what exactly the highlighted text represents

            If the highlighted text contains statistics, percentages, or measurements, always specify what they measure or refer to."""
    
    # Add the context to the prompt
    prompt += f"\n\nHere is the surrounding context (the highlighted text is inside this excerpt):\n\n{full_text}"
    
    try:
        # Call existing API utility with modified developer instructions
        explanation = API_text_input(prompt, 
            "Generate a contextually accurate explanation that explicitly identifies what the highlighted text refers to in the surrounding content")
        print(explanation)
        return jsonify({
            "explanation": explanation
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500