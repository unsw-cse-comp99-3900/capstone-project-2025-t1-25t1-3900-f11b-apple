from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import os
import atexit
from API import API_text_input
from util import extract_text_from_pdf

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
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

# Endpoint for handling highlighted text explanations
# Endpoint for handling highlighted text explanations
@app.route("/explain-highlight", methods=["POST"])
def explain_highlight():
    data = request.json
    if not data or "highlighted_text" not in data or "filename" not in data:
        return jsonify({"error": "Missing highlighted_text or filename in request"}), 400

    highlighted_text = data["highlighted_text"]
    filename = data["filename"]
    # Get the prompt type from the request, default to "Definition" if not provided
    prompt_type = data.get("prompt_type", "Definition")

    file_path = os.path.join(UPLOAD_FOLDER, filename)

    # Ensure the file exists before trying to extract text
    if not os.path.exists(file_path):
        return jsonify({"error": f"File {filename} not found on server"}), 404

    try:
        # Extract the full text for context (assuming util.py has this function)
        full_text = extract_text_from_pdf(file_path)
        # Limit context size if needed (e.g., OpenAI token limits) - adjust as necessary
        max_context_length = 3000 # Example limit, adjust based on model/needs
        if len(full_text) > max_context_length:
           # Basic truncation, might need smarter context handling
           context_for_prompt = full_text[:max_context_length] + "..."
        else:
           context_for_prompt = full_text

    except Exception as e:
        # Log the error for debugging
        print(f"Error extracting text from {filename}: {e}")
        return jsonify({"error": f"Could not extract text from PDF: {e}"}), 500

    # Define instructions based on prompt_type
    instruction = ""
    if prompt_type == "ELI5":
        instruction = "Explain the following highlighted text in a very simple and concise way, suitable for a 5-year-old. Focus on the core meaning within the provided context:"
    elif prompt_type == "Real world analogy":
        instruction = "Explain the following highlighted text using a brief, clear real-world analogy relevant to the provided context:"
    else: # Default or "Definition"
        instruction = """Explain this highlighted text in context: '{highlighted_text}'

            Your explanation must:
            1. Explicitly reference what specific entities or values the highlighted text refers to in the surrounding context (e.g., if "8%" is highlighted, explain exactly what this percentage represents)
            2. Include critical context from surrounding paragraphs needed to fully understand the highlighted text
            3. Be concise (under 150 words) but complete
            4. Use clear, precise language
            5. Prioritize explaining references, relationships, and what exactly the highlighted text represents

            If the highlighted text contains statistics, percentages, or measurements, always specify what they measure or refer to.

            Highlighted Text to Explain:"""


    # Construct the final prompt for the AI
    # If default/definition, replace the placeholder; otherwise, append the highlighted text.
    if prompt_type == "Definition" or prompt_type == "Default":
         # The default instruction already contains the placeholder format
         # (Assuming the placeholder '{highlighted_text}' was part of the original default instruction)
         # If not, adjust accordingly. Let's assume it wasn't and structure it like the others:
         instruction = """Explain this highlighted text providing context and identifying specific references:""" # Simplified default instruction
         final_prompt = f"{instruction}\n\nHighlighted Text: \"{highlighted_text}\"\n\nFull Document Context (excerpt):\n{context_for_prompt}"

    else:
        final_prompt = f"{instruction}\n\nHighlighted Text: \"{highlighted_text}\"\n\nFull Document Context (excerpt):\n{context_for_prompt}"


    try:
        # Define a generic developer message for the API call
        dev_msg = f"Generate explanation for highlighted text based on user request type: {prompt_type}"
        # Call existing API utility with the constructed prompt and dev_msg
        explanation = API_text_input(final_prompt, dev_msg)
        print(f"Generated explanation ({prompt_type}): {explanation}") # Log explanation
        return jsonify({
            "explanation": explanation
        })
    except Exception as e:
        print(f"Error calling AI API: {e}") # Log the error
        return jsonify({"error": f"Failed to get explanation from AI: {str(e)}"}), 500

def cleanup():
    for pdf in os.listdir(UPLOAD_FOLDER):
        file_path = os.path.join(UPLOAD_FOLDER, pdf)
        os.remove(file_path)
        print(f"PDF deleted: {file_path}")

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
    
atexit.register(cleanup)
