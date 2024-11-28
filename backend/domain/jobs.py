from abc import ABC, abstractmethod
import uuid
from uuid import UUID
from datetime import datetime
from dataclasses import dataclass
from typing import List, Optional, Tuple

@dataclass
class Address:
    country: str
    city: str
    state: str
    location: str

@dataclass
class Job:
    id: UUID
    company: str
    job_title: str
    address: Address
    last_updated: datetime
    apply_url: Optional[str] = None
    source_id: Optional[str] = None
    
    @classmethod
    def new(cls, company: str, job_title: str,
        address: Address, apply_url: str, source_id: str,
        last_updated: datetime = None) -> "Job":

        return cls(
            id = uuid.uuid4(),
            company = company,
            job_title = job_title,
            address = address,
            last_updated = last_updated or datetime.now(),
            apply_url = apply_url,
            source_id = source_id
        )
        
    def update(self, company: str, job_title: str, address: Address, apply_url: str,
               last_updated: datetime = None) -> None:
        self.company = company
        self.job_title = job_title
        self.address = address
        self.apply_url = apply_url
        self.last_updated = last_updated or datetime.now()

class JobRepository(ABC):
    @abstractmethod
    def save(self, job: Job) -> None:
        pass
    
    @abstractmethod
    def get_job_by_id(self, job_id: UUID) -> Optional[Job]:
        pass
    
    @abstractmethod
    def list_jobs(self, limit, last_key_value: Optional[str] = None) -> Tuple[List[Job], Optional[str]]:
        pass
    
    @abstractmethod
    def delete_job_by_id(self, job_id: UUID) -> bool:
        pass
    
    @abstractmethod
    def get_by_source_id(self, source_id: str) -> Optional[Job]:
        pass
