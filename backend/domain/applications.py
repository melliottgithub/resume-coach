from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import datetime
from typing import List, Optional
from enum import Enum
import uuid
from uuid import UUID

from .jobs import Job
from .documents import Document, DocumentType

class JobApplicationStatus(Enum):
    CREATED = "Created"
    ANALYZED = "Analyzed"

@dataclass
class JobApplication:
    id: UUID
    title: str
    status: JobApplicationStatus
    user_id: UUID
    job_id: UUID
    created_at: datetime
    
    @classmethod
    def new(cls, user_id: UUID, Job: Job) -> "JobApplication":
        return cls(
            id=uuid.uuid4(),
            title=Job.job_title,
            status=JobApplicationStatus.ANALYZED,
            user_id=user_id,
            job_id=Job.id,
            created_at=datetime.now()
        )

    def add_analysis_results(self, report_text: str):
        self.coaching_report = Document(self.id, DocumentType.COACHING_REPORT, report_text)
        self.status = JobApplicationStatus.ANALYZED

class JobApplicationRepository(ABC):
    @abstractmethod
    def save(self, job_application: JobApplication) -> None:
        pass
    
    @abstractmethod
    def get_by_id(self, job_application_id: uuid.UUID) -> Optional[JobApplication]:
        pass
    
    @abstractmethod
    def list_applications(self, user_id: UUID, limit: int) -> List[JobApplication]:
        pass
    
    @abstractmethod
    def delete_by_id(self, job_application_id: uuid.UUID) -> bool:
        pass