import re
from typing import List, Dict
from config.settings import KNOWLEDGE_BASE_DIR
from rag.document_loader import DocumentLoader
from rag.chunker import DocumentChunker

class LocalRetriever:
    def __init__(self):
        self.documents = DocumentLoader.load_markdown_files(KNOWLEDGE_BASE_DIR)
        self.chunks = []
        for doc in self.documents:
            chunks = DocumentChunker.chunk_text(doc["content"])
            for idx, c in enumerate(chunks):
                self.chunks.append({
                    "filename": doc["filename"],
                    "category": doc["category"],
                    "chunk_id": f"{doc['filename']}_{idx}",
                    "text": c
                })

    def search(self, query: str, top_k: int = 3) -> List[Dict]:
        query_words = set(re.findall(r"\w+", query.lower()))
        scored_chunks = []

        for item in self.chunks:
            chunk_words = set(re.findall(r"\w+", item["text"].lower()))
            overlap = query_words.intersection(chunk_words)
            score = len(overlap)
            if score > 0:
                scored_chunks.append({
                    "source": item["filename"],
                    "category": item["category"],
                    "evidence": item["text"][:300] + "...",
                    "score": score
                })

        scored_chunks.sort(key=lambda x: x["score"], reverse=True)
        return scored_chunks[:top_k]

# Global shared retriever instance
local_retriever = LocalRetriever()
