try:
    from sentence_transformers import SentenceTransformer
    embedding_model = SentenceTransformer("BAAI/bge-small-en-v1.5")
except Exception as e:
    print(f"[WARNING] Could not load SentenceTransformer in embedding.py: {e}")
    embedding_model = None
