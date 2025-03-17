from openai import OpenAI

with open('key.txt','r') as file:
    global key
    key = " ".join(line.rstrip() for line in file)
    
client = OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key=key,
)

def text_explanation(text):
  """
  Function for generating an explanation for a section text
  Arguments:
    text - a section of text, must be a string
  Return:
    string representing the explanation
  """
  completion = client.chat.completions.create(
    model="google/gemini-2.0-pro-exp-02-05:free",
    messages=[
      {
        "role": "developer",
        "content": "Give an explanation of the text provided by the user."
      },
      {
        "role": "user",
        "content": text
      }
    ]
  )
  return completion.choices[0].message.content


def image_explanation(image):
  """
  Function for generating an explanation for an image
  Arguments:
    image - a url to an image, must be a string
  Return:
    string representing the explanation
  """
  completion = client.chat.completions.create(
    model="google/gemini-2.0-pro-exp-02-05:free",
    messages=[
      {
        "role": "developer",
        "content": "Give an explanation of the image provided by the user."
      },
      {
        "role": "user",
        "content": [
          {
            "type": "image_url",
            "image_url": {
                "url": image,
            },
          },
        ]
      }
    ]
  )
  return completion.choices[0].message.content