import os
from pathlib import Path
from typing import List, Dict

class DocumentLoader:
    @staticmethod
    def load_markdown_files(directory: Path) -> List[Dict[str, str]]:
        documents = []
        if not directory.exists():
            return documents

        for file_path in directory.rglob("*.md"):
            try:
                content = file_path.read_text(encoding="utf-8")
                category = file_path.parent.name
                documents.append({
                    "filename": str(file_path.relative_to(directory)),
                    "category": category,
                    "content": content
                })
            except Exception as e:
                print(f"Error loading {file_path}: {e}")
        return documents
