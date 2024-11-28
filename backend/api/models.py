from typing import List, Optional
from pydantic import BaseModel
from domain.jobs import Address, Job

class JobApplicationRequest(BaseModel):
    job_id: str
    resume_text: Optional[str] = None
    resume_file_base64: Optional[str] = None
    
class JobApplicationResponse(BaseModel):
    id: str
    status: str
    created_at: str
    coaching_report: str

class UserRequest(BaseModel):
    name: str
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    
class AuthRequest(BaseModel):
    email: str
    password: str
    
class AuthResponse(BaseModel):
    user_name: str
    access_token: str
    token_type: str
    
class JobRequest(BaseModel):
    company: str
    job_title: str
    address: Address
    apply_url: str | None
    
class ChatMessageRequest(BaseModel):
    message: str
    
class JobPaginedList(BaseModel):
    items: List[Job]
    limit: int
    last_key_value: Optional[str]