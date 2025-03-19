from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import os
import atexit
from API import API_text_input  

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
@app.route("/explain-highlight", methods=["POST"])
def explain_highlight():
    data = request.json
    if not data or "highlighted_text" not in data:
        return jsonify({"error": "No highlighted text provided"}), 400
    
    highlighted_text = data["highlighted_text"]
    full_text = data.get("full_text", "")  
    
    prompt = f"""Explain this highlighted text in context: '{highlighted_text}'

Your explanation must:
1. Explicitly reference what specific entities or values the highlighted text refers to in the surrounding context (e.g., if "8%" is highlighted, explain exactly what this percentage represents)
2. Include critical context from surrounding paragraphs needed to fully understand the highlighted text
3. Be concise (under 150 words) but complete
4. Use clear, precise language
5. Prioritize explaining references, relationships, and what exactly the highlighted text represents

If the highlighted text contains statistics, percentages, or measurements, always specify what they measure or refer to."""
    
    # Always include full text for context, with better handling
    if full_text:
        # Find the position of the highlighted text in the full text
        try:
            highlight_position = full_text.find(highlighted_text)
            
            # Extract a larger window around the highlighted text (1000 chars before and after)
            start_idx = max(0, highlight_position - 1000)
            end_idx = min(len(full_text), highlight_position + len(highlighted_text) + 1000)
            
            # Get the immediate context
            context_window = full_text[start_idx:end_idx]
            
            # Add the context to the prompt
            prompt += f"\n\nHere is the surrounding context (the highlighted text is inside this excerpt):\n\n{context_window}"
            
            # Also provide the full document, but as supplementary information
            prompt += f"\n\nFull document (for additional reference if needed):\n{full_text[:3000]}..."
        except:
            # Fallback in case of any string search issues
            prompt += f"\n\nHere is the full document text:\n{full_text[:3000]}..."
    
    try:
        # Call existing API utility with modified developer instructions
        explanation = API_text_input(prompt, 
            "Generate a contextually accurate explanation that explicitly identifies what the highlighted text refers to in the surrounding content")
        
        return jsonify({
            "explanation": explanation
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def cleanup():
    for pdf in os.listdir(UPLOAD_FOLDER):
        file_path = os.path.join(UPLOAD_FOLDER, pdf)
        os.remove(file_path)
        print(f"PDF deleted: {file_path}")

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
    
atexit.register(cleanup)
