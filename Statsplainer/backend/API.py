from openai import OpenAI
import base64

ai_model = "openai/gpt-4.1"

#------------------------------------------------------------------------------------
#                   SETTING UP API CLIENT/KEY
#------------------------------------------------------------------------------------

with open('key.txt','r') as file:
    global key
    key = " ".join(line.rstrip() for line in file)
    
client = OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key=key,
) 

#------------------------------------------------------------------------------------
#                   STATSPLAINER FEATURE IMPLEMENTATIONS
#------------------------------------------------------------------------------------

# Gives a response to a user's question/query.
def user_query(query):
  completion = client.chat.completions.create(
    model=ai_model,
    messages=[
      {
        "role": "system",
        "content": "Please format your response using Markdown."
      },
      {
        "role": "user",
        "content": query
      }
    ]
  )
  print(completion.choices[0].message.content)
  return completion.choices[0].message.content

#------------------------------------------------------------------------------------
#                   API WRAPPERS
#------------------------------------------------------------------------------------

def API_text_input(text, dev_msg, image_base64=None, temperature=0.7):
  """
  Returns generated text from LLM with text argument
  Arguments:
    text - a section of text, must be a string
    prompt - developer message to LLM, must be a string
  Return:
    string representing the explanation
  """

  if image_base64:
    msg=[
      {
        "role": "system",
        "content": "Please format your response using Markdown."
      },
      {
        "role": "system",
        "content": dev_msg
      },
      {
        "role": "user",
        "content": [
          {
              "type": "text",
              "text": text,
          },
          {
            "type": "image_url",
            "image_url": {
                "url": f"data:image/png;base64,{image_base64}",
            },
          },
        ]
      }
    ]
    
  else:
      msg = [
          {
            "role": "system",
            "content": "Please format your response using Markdown."
          },
          {
              "role": "user",
              "content": [
                  {
                      "type": "text",
                      "text": text,
                  }
              ]
          },
          {
              "role": "system",
              "content": dev_msg
          }
      ]

  completion = client.chat.completions.create(
    model=ai_model,
    messages=msg,
    temperature=temperature
  )
  return completion.choices[0].message.content





