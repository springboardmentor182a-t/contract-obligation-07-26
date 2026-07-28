import pickle
import faiss
import numpy as np
import os

from chatbot.embedding import embedding_model

def retrieve(question):

    if not os.path.exists("vector_db/contracts.index") or not os.path.exists("vector_db/chunks.pkl"):
        return "No contracts have been indexed yet. Please upload a contract first."

    index = faiss.read_index(
        "vector_db/contracts.index"
    )

    with open(
        "vector_db/chunks.pkl",
        "rb"
    ) as f:

        chunks = pickle.load(f)

    query = embedding_model.encode([question])

    d,i = index.search(
        np.array(query),
        5
    )

    context=""

    for idx in i[0]:

        context += chunks[idx]+"\n"

    return context
