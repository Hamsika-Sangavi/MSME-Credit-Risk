import chromadb
import ollama
from knowledge_base.guidelines import guideline_documents

# Persistent client so the DB survives between runs
client = chromadb.PersistentClient(path="./chroma_db")
collection = client.get_or_create_collection(name="msme_guidelines")

def embed_text(text: str) -> list:
    response = ollama.embeddings(model="nomic-embed-text", prompt=text)
    return response["embedding"]

def setup_knowledge_base():
    # Only add documents if collection is empty (avoid duplicates on re-run)
    existing = collection.count()
    if existing > 0:
        print(f"Knowledge base already has {existing} documents. Skipping setup.")
        return

    for doc in guideline_documents:
        embedding = embed_text(doc["text"])
        collection.add(
            ids=[doc["id"]],
            embeddings=[embedding],
            documents=[doc["text"]]
        )
    print(f"Added {len(guideline_documents)} guideline documents to knowledge base.")

def retrieve_relevant_guidelines(query: str, top_k: int = 3) -> list:
    query_embedding = embed_text(query)
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k
    )
    return results["documents"][0]  # list of matching guideline texts