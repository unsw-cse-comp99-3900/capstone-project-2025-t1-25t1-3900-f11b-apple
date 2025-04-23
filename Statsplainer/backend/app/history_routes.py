from flask import Flask, request, jsonify, Blueprint, current_app
import os
import json

history_routes = Blueprint("history_routes", __name__)

# This function saves a JSON file with the given file name and contents
@history_routes.route('/upload_history/<filename>', methods=['POST'])
def upload_history():
    if not request.is_json:
        return jsonify({"error": "Request must be in JSON format"}), 400

    data = request.get_json()

    # Expect 'filename' and 'content' in the JSON
    filename = data.get("filename")
    chat_history = data.get("content")

    if not filename or not chat_history:
        return jsonify({"error": "Missing 'filename' or 'content' in request body"}), 400

    safe_filename = f"{filename}.json"
    filepath = os.path.join(current_app.config['HISTORY_FOLDER'], safe_filename)

    # Save JSON content
    with open(filepath, 'w') as f:
        json.dump(chat_history, f)

    return jsonify({"message": "File saved successfully", "file": safe_filename}), 200

# This function sends a JSON file with the given file name
@history_routes.route('/retrieve_history/<filename>', methods=['GET'])
def retrieve_history():
    requested_file = request.args.get("filename")

    if not requested_file:
        return jsonify({"error": "Missing 'filename' parameter"}), 400

    filename = f"{requested_file}.json"
    filepath = os.path.join(current_app.config['HISTORY_FOLDER'], filename)

    if not os.path.exists(filepath):
        return jsonify({"error": "File not found"}), 404

    with open(filepath, 'r') as f:
        chat_history = json.load(f)

    return jsonify(chat_history), 200