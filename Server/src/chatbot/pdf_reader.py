import fitz

def extract_text(pdf):

    doc = fitz.open(pdf)

    text = ""

    for page in doc:
        text += page.get_text()

    return text
