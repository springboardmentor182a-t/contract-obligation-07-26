def chunk_text(text, size=300, overlap=50):

    chunks = []

    start = 0

    while start < len(text):

        end = start + size

        chunks.append(text[start:end])

        start += size - overlap

    return chunks
