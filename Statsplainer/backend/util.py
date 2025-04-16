import fitz

def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text("text") + "\n"
    return text.strip()

def prompt_builder(mode):
    if mode == "Definition":
        return """
                Explain the given text/user request using the 'Full Context from PDF'.
                Your explanation must:
                1. Explicitly reference what specific entities or values the highlighted text refers to in the surrounding context (e.g., if "8%" is highlighted, explain exactly what this percentage represents based on the context).
                2. If statistics are highlighted focus on explaining what these statistics mean including their implications and significance (e.g if P values are said explain in a short sentence what a P value is then continue on with explaining the implications and significance of the statistucs).
                3. Include critical context from surrounding paragraphs needed to fully understand the highlighted text.
                4. Be concise (under 150 words) but complete.
                5. Use clear, precise language.
                6. Prioritize explaining references, relationships, and what exactly the highlighted text represents within the provided context.
                7. If the highlighted text contains statistics, percentages, or measurements, always specify what they measure or refer to according to the context.
            """
    elif mode == "ELI5":
        return """
                Your explaination must:
                1. Explain the 'Highlighted Text' in very simple terms, like you're talking to a five-year-old, using the 'Full Context from PDF' to understand what the text means, this also applies for the other instructions below.
                2. If statistics are highlighted focus on explaining what these statistics mean including their implications and significance such that a five-year-old can understand them.
                3. Be concise (under 150 words) but complete.
            """
    elif mode == "Real world analogy":
        return """
                Your explaination must:
                1. Provide a real-world analogy to help understand the concept presented in the 'Highlighted Text', using the 'Full Context from PDF' to understand the concept. This also applies for the other instructions below.
                2. If statistics are highlighted focus on explaining what these statistics mean including their implications and significance using real-world analogies.
                3. Be concise (under 150 words) but complete.
            """
    else:
        # Default to definition if mode is unknown or invalid
        return """
                Your explaination must:
                1. Explain the 'Highlighted Text' using the 'Full Context from PDF'.
                2. If statistics are highlighted focus on explaining what these statistics mean including their implications and significance (e.g if P values are said explain in a short sentence what a P value is then continue on with explaining the implications and significance of the statistucs).
                3. Be concise (under 150 words) but complete.
            """