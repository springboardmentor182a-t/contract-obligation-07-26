import pickle
import faiss
import numpy as np
import os

from src.chatbot.embedding import embedding_model

index = faiss.IndexFlatL2(384)

def save_chunks(chunks):

    embeddings = embedding_model.encode(chunks)

    index.add(np.array(embeddings))

    os.makedirs("vector_db", exist_ok=True)

    faiss.write_index(
        index,
        "vector_db/contracts.index"
    )

    with open(
        "vector_db/chunks.pkl",
        "wb"
    ) as f:

        pickle.dump(chunks,f)
        