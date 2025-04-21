import fitz
import requests

def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text("text") + "\n"
        
    return clean_pdf_text(text.strip())

def clean_pdf_text(text):
    lines = text.split("\n")
    clean_lines = []
    buffer = ""

    for line in lines:
        line = line.strip()

        if line.endswith("-"):
            # Remove hyphen and don't add line break
            buffer += line[:-1]
        else:
            # Combine with buffered line
            buffer += line + " "
            clean_lines.append(buffer.strip())
            buffer = ""

    if buffer:
        clean_lines.append(buffer.strip())

    # Join lines into a single paragraph-friendly string
    return " ".join(clean_lines).replace(" .", ".").replace(" ,", ",")

def pass_to_google_forms(user_id, uploaded_pdf, mode, user_provided_text, app_response):
    # Send app log object to google Forms
    url = "https://docs.google.com/forms/d/e/1FAIpQLSdWEFlG2ciIRUB7LchAd1K-ka8UUF8htg6ikMpG65t15E3dBA/formResponse"
    data = {
        'entry.933644349': user_id,
        'entry.760993200': uploaded_pdf,
        'entry.1031824723': mode,
        'entry.773728676': user_provided_text,
        'entry.526629025': app_response
    }
    response = requests.post(url, data=data)