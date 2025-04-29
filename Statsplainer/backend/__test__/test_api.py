import pytest
from unittest.mock import patch, MagicMock
import API # Changed from relative import

# Mock the genai module used within API.py
@patch('API.genai')
def test_API_text_input_success_text_only(mock_genai):
    """Verify successful text generation without images."""
    # Arrange
    mock_model_instance = MagicMock()
    mock_response = MagicMock()
    mock_response.text = "Mocked successful AI response"
    mock_model_instance.generate_content.return_value = mock_response
    mock_genai.GenerativeModel.return_value = mock_model_instance
    mock_config_instance = MagicMock()
    mock_genai.types.GenerationConfig.return_value = mock_config_instance

    messages = [
        {"role": "user", "content": "What is a p-value?"},
        {"role": "assistant", "content": "It's a measure of statistical significance."},
        {"role": "user", "content": "Explain more."}
    ]
    dev_msg = "Explain like I'm a beginner."
    temperature = 0.5

    expected_gemini_history = [
        {'role': 'user', 'parts': [{'text': 'What is a p-value?'}]},
        {'role': 'model', 'parts': [{'text': "It's a measure of statistical significance."}]},
        {'role': 'user', 'parts': [{'text': 'Explain more.'}]}
    ]

    # Construct expected system instruction based on API.py logic
    base_instruction = """Please format your response using Markdown.
Ensure that for answering to user queries:
1. The user query is related to the pdf, if it isnt related to the pdf (such as random text or off topic requests) ask the user politely to ask a question related to the pdf.
2. If the off topic question relates to anything dangerous or inflicts self harm tell the user politely to refrain from such requests and to seek help.
3. If the question is off topic do not state a summary.
End of user query preferences for the response."""
    dev_instruction = f"\n\nDeveloper Instructions:\n{dev_msg}"
    context_hint = (
        "\n\nConversation Context Hint:\nThe conversation history contains previously highlighted texts and user queries marked as '(Highlighted Text / user query)', "
        "and your earlier replies marked as '(Explanation)'. When the user asks follow-up questions, "
        "refer back to those highlights and your responses as needed."
    )
    expected_system_instruction = "\n".join([base_instruction, dev_instruction, context_hint])

    # Act
    result = API.API_text_input(messages, dev_msg, temperature=temperature)

    # Assert
    mock_genai.GenerativeModel.assert_called_once_with(
        model_name="models/gemini-1.5-flash-latest",
        system_instruction=expected_system_instruction
    )
    mock_genai.types.GenerationConfig.assert_called_once_with(temperature=temperature)
    mock_model_instance.generate_content.assert_called_once_with(
        expected_gemini_history,
        generation_config=mock_config_instance
    )
    assert result == "Mocked successful AI response"

@patch('API.genai')
def test_API_text_input_success_with_image(mock_genai):
    """Verify successful text generation with an image."""
    # Arrange
    mock_model_instance = MagicMock()
    mock_response = MagicMock()
    mock_response.text = "Mocked response about the image"
    mock_model_instance.generate_content.return_value = mock_response
    mock_genai.GenerativeModel.return_value = mock_model_instance
    mock_config_instance = MagicMock()
    mock_genai.types.GenerationConfig.return_value = mock_config_instance

    messages = [
        {"role": "user", "content": "Describe this image"}
    ]
    dev_msg = "Focus on the colors."
    image_base64 = "dummy_base64_data"
    temperature = 0.8

    expected_gemini_history = [
        {'role': 'user', 'parts': [
            {'text': 'Describe this image'},
            # Image part added by the function
            {'mime_type': 'image/jpeg', 'data': image_base64}
        ]}
    ]
    # Construct expected system instruction (similar to previous test)
    base_instruction = """Please format your response using Markdown.
Ensure that for answering to user queries:
1. The user query is related to the pdf, if it isnt related to the pdf (such as random text or off topic requests) ask the user politely to ask a question related to the pdf.
2. If the off topic question relates to anything dangerous or inflicts self harm tell the user politely to refrain from such requests and to seek help.
3. If the question is off topic do not state a summary.
End of user query preferences for the response."""
    dev_instruction = f"\n\nDeveloper Instructions:\n{dev_msg}"
    context_hint = (
        "\n\nConversation Context Hint:\nThe conversation history contains previously highlighted texts and user queries marked as '(Highlighted Text / user query)', "
        "and your earlier replies marked as '(Explanation)'. When the user asks follow-up questions, "
        "refer back to those highlights and your responses as needed."
    )
    expected_system_instruction = "\n".join([base_instruction, dev_instruction, context_hint])


    # Act
    result = API.API_text_input(messages, dev_msg, image_base64=image_base64, temperature=temperature)

    # Assert
    mock_genai.GenerativeModel.assert_called_once_with(
        model_name="models/gemini-1.5-flash-latest",
        system_instruction=expected_system_instruction
    )
    mock_genai.types.GenerationConfig.assert_called_once_with(temperature=temperature)
    # Check that generate_content was called with history including the image part
    mock_model_instance.generate_content.assert_called_once_with(
        expected_gemini_history,
        generation_config=mock_config_instance
    )
    assert result == "Mocked response about the image"

@patch('API.genai')
def test_API_text_input_api_error_returns_message(mock_genai):
    """Verify a generic error message is returned if the API call fails."""
    # Arrange
    mock_model_instance = MagicMock()
    # Simulate an error during the API call
    mock_model_instance.generate_content.side_effect = Exception("Google API Error")
    mock_genai.GenerativeModel.return_value = mock_model_instance
    mock_genai.types.GenerationConfig.return_value = MagicMock()

    messages = [{"role": "user", "content": "Explain confidence interval"}]
    dev_msg = "Test API error"
    expected_error_message = "An error occurred while generating the explanation."

    # Act
    result = API.API_text_input(messages, dev_msg)

    # Assert
    mock_genai.GenerativeModel.assert_called_once() # Model is still instantiated
    mock_genai.types.GenerationConfig.assert_called_once() # Config is still created
    mock_model_instance.generate_content.assert_called_once() # generate_content is called
    assert result == expected_error_message # Check for the specific error message returned by the function

@patch('API.genai')
def test_API_text_input_no_dev_msg(mock_genai):
    """Verify system instruction is correct when dev_msg is None."""
    # Arrange
    mock_model_instance = MagicMock()
    mock_response = MagicMock()
    mock_response.text = "Response without dev msg"
    mock_model_instance.generate_content.return_value = mock_response
    mock_genai.GenerativeModel.return_value = mock_model_instance
    mock_genai.types.GenerationConfig.return_value = MagicMock()

    messages = [{"role": "user", "content": "Hi"}]
    dev_msg = None # No developer message
    temperature = 0.7

    # Construct expected system instruction (without dev_instruction part)
    base_instruction = """Please format your response using Markdown.
Ensure that for answering to user queries:
1. The user query is related to the pdf, if it isnt related to the pdf (such as random text or off topic requests) ask the user politely to ask a question related to the pdf.
2. If the off topic question relates to anything dangerous or inflicts self harm tell the user politely to refrain from such requests and to seek help.
3. If the question is off topic do not state a summary.
End of user query preferences for the response."""
    context_hint = (
        "\n\nConversation Context Hint:\nThe conversation history contains previously highlighted texts and user queries marked as '(Highlighted Text / user query)', "
        "and your earlier replies marked as '(Explanation)'. When the user asks follow-up questions, "
        "refer back to those highlights and your responses as needed."
    )
    expected_system_instruction = "\n".join([base_instruction, context_hint]) # Note: No dev_instruction

    # Act
    result = API.API_text_input(messages, dev_msg, temperature=temperature)

    # Assert
    mock_genai.GenerativeModel.assert_called_once_with(
        model_name="models/gemini-1.5-flash-latest",
        system_instruction=expected_system_instruction # Verify instruction without dev part
    )
    mock_genai.types.GenerationConfig.assert_called_once_with(temperature=temperature)
    mock_model_instance.generate_content.assert_called_once()
    assert result == "Response without dev msg"
