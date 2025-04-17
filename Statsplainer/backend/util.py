import fitz

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