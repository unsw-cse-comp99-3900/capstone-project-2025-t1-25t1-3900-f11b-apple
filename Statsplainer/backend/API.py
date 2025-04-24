import google.generativeai as genai
import base64
import os # Added for potential future use with env vars, though not needed now

# Use the specific model name format for Gemini API
ai_model = "models/gemini-1.5-flash-latest"

#------------------------------------------------------------------------------------
#                   SETTING UP API CLIENT/KEY
#------------------------------------------------------------------------------------

# Read the API key from key.txt
try:
    with open('key.txt', 'r') as file:
        key = file.read().strip()
    if not key:
        raise ValueError("API key file 'key.txt' is empty.")
    genai.configure(api_key=key)
except FileNotFoundError:
    print("Error: API key file 'key.txt' not found.")
    # Handle the error appropriately, e.g., exit or raise
    raise
except Exception as e:
    print(f"Error configuring Generative AI: {e}")
    raise

# Removed OpenAI client initialization

#------------------------------------------------------------------------------------
#                   STATSPLAINER FEATURE IMPLEMENTATIONS
#------------------------------------------------------------------------------------

# Gives a response to a user's question/query. (Updated for Gemini)
def user_query(query):
  try:
    model = genai.GenerativeModel(ai_model)
    # Combine system instruction with user query for simple cases
    # Note: For more complex scenarios, use system_instruction in GenerativeModel
    full_query = f"System instruction: Please format your response using Markdown.\n\nUser query: {query}"
    response = model.generate_content(full_query)
    # print(response.text) # Keep print for debugging if needed, but remove for production
    return response.text
  except Exception as e:
    print(f"Error during Gemini API call in user_query: {e}")
    # Consider returning a user-friendly error message
    return "An error occurred while processing your request."

#------------------------------------------------------------------------------------
#                   API WRAPPERS
#------------------------------------------------------------------------------------

def API_text_input(messages, dev_msg, image_base64=None, temperature=0.7):
  """
  Returns generated text from LLM using Google Gemini.
  Arguments:
    messages - List of dictionaries representing conversation history
               (expected format: {'role': 'user'/'assistant', 'content': '...'})
    dev_msg - Developer message/prompt to guide the LLM, string or None.
    image_base64 - Base64 encoded image string (optional, for multimodal).
    temperature - Controls randomness (0.0 to 1.0).
  Return:
    string representing the explanation, or an error message.
  """
  try:
    # --- System Instruction Construction ---
    system_instruction_parts = []
    
    # Base instruction
    system_instruction_parts.append("""Please format your response using Markdown.
Ensure that for answering to user queries:
1. The user query is related to the pdf, if it isnt related to the pdf (such as random text or off topic requests) ask the user politely to ask a question related to the pdf.
2. If the off topic question relates to anything dangerous or inflicts self harm tell the user politely to refrain from such requests and to seek help.
3. If the question is off topic do not state a summary.
End of user query preferences for the response.""")

    # Add developer message if provided
    if dev_msg:
        system_instruction_parts.append(f"\n\nDeveloper Instructions:\n{dev_msg}")

    # Add chat history context hint
    system_instruction_parts.append(
        "\n\nConversation Context Hint:\nThe conversation history contains previously highlighted texts and user queries marked as '(Highlighted Text / user query)', "
        "and your earlier replies marked as '(Explanation)'. When the user asks follow-up questions, "
        "refer back to those highlights and your responses as needed."
    )
    
    system_instruction_text = "\n".join(system_instruction_parts)

    # --- History Conversion ---
    gemini_history = []
    for msg in messages:
        role = msg.get('role')
        content = msg.get('content')
        if role == 'user':
            gemini_history.append({'role': 'user', 'parts': [{'text': content}]})
        elif role == 'assistant': # Map 'assistant' to 'model'
             gemini_history.append({'role': 'model', 'parts': [{'text': content}]})
        # Ignore other roles or handle as needed

    # --- Model Instantiation and API Call ---
    model = genai.GenerativeModel(
        model_name=ai_model,
        system_instruction=system_instruction_text
    )
    
    generation_config = genai.types.GenerationConfig(
        temperature=temperature
        # Add other config like top_p, top_k if needed
    )

    # Handle potential image input (basic example)
    if image_base64:
         # Assuming the last message in gemini_history is the user prompt associated with the image
         if gemini_history and gemini_history[-1]['role'] == 'user':
             # This is a simplified way; requires image format detection and proper structuring
             # For robust multimodal, refer to Gemini documentation
             image_parts = [
                 {"mime_type": "image/jpeg", "data": image_base64} # Adjust mime_type as needed
             ]
             # Append image parts to the last user message parts
             gemini_history[-1]['parts'].extend(image_parts)
         else:
              # Handle case where image is provided without a preceding user message or history is empty
              print("Warning: Image provided but no suitable user message found to attach it to.")
              # Decide how to handle this: maybe create a new user message?
              # For now, we'll proceed without the image if context is unclear.
              pass


    response = model.generate_content(
        gemini_history,
        generation_config=generation_config
        # stream=False # Set to True for streaming responses
    )

    return response.text
  
  except Exception as e:
    print(f"Error during Gemini API call in API_text_input: {e}")
    # Consider more specific error handling based on Gemini API errors
    # Log the error details (e.g., messages, dev_msg) for debugging
    # print(f"History: {gemini_history}")
    # print(f"System Instruction: {system_instruction_text}")
    return "An error occurred while generating the explanation."





