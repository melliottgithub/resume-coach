from abc import ABC, abstractmethod
from enum import Enum
from uuid import UUID

class DocumentType(Enum):
    RESUME = "Resume"
    JOB_DESCRIPTION = "Job_Description"
    COACHING_REPORT = "Coaching_Report"
    CHAT_HISTORY = "Chat_History"

class Document:
    def __init__(self, id: UUID, document_type: DocumentType, content: str):
        self.id = id
        self.document_type = document_type
        self.content = content

    def update_content(self, new_content: str):
        self.content = new_content
    
class DocumentRepository(ABC):
    @abstractmethod
    def save(self, document: Document):
        pass

    @abstractmethod
    def get_by_id(self, id: UUID, document_type: DocumentType) -> Document:
        pass