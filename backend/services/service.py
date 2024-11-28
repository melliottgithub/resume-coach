import datetime
from typing import List, Optional, Tuple
from uuid import UUID
from fastapi import HTTPException

from inject import Injector
from pdf_parser import parse_file
from domain.users import User, UserRepository
from domain.jobs import Address, Job, JobRepository
from domain.documents import Document, DocumentRepository, DocumentType

from domain.applications import JobApplication, JobApplicationRepository
from domain.coaching import analyze_application, create_chatbot, parse_chat_history, serialize_chat_history

class JobApplicationService:
    def __init__(self):
        self.users = Injector.resolve(UserRepository)
        self.jobs = Injector.resolve(JobRepository)
        self.applications = Injector.resolve(JobApplicationRepository)
        self.documents = Injector.resolve(DocumentRepository)
        
    # User operations
    def get_user_by_id(self, user_id: str):
        return self.users.get_by_id(user_id)
    
    def get_user_by_email(self, email: str):
        return self.users.get_by_email(email)
    
    def create_user(self, name: str, email: str, password: str):
        user = self.users.get_by_email(email)
        if user is not None:
            raise HTTPException(status_code=400, detail="User already exists")
        new_user = User.new(name, email, password)
        self.users.save(new_user)
        return new_user
    
    def authenticate_user(self, email: str, password: str) -> User:
        user = self.users.get_by_email(email)
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        if user.authenticate(password) is False:
            raise HTTPException(status_code=401, detail="Invalid password")
        return user

    # Job operations
    def list_jobs(self, limit, last_key_value: Optional[str] = None) -> Tuple[List[Job], Optional[str]]:
        return self.jobs.list_jobs(limit=limit, last_key_value=last_key_value)

    def get_job_by_id(self, job_id: str):
        job_uuid = UUID(job_id)
        return self.jobs.get_job_by_id(job_uuid.hex)
    
    def create_job(self, company: str, job_title: str, address: Address, apply_url: str, \
        source_id: str, last_updated: datetime, description: str):
        new_job = Job.new(company, job_title, address, apply_url, source_id, last_updated)
        document = Document(new_job.id, DocumentType.JOB_DESCRIPTION, description)
        self.documents.save(document)
        self.jobs.save(new_job)
        return new_job
    
    def add_or_update_job(self, company: str, job_title: str, address: Address, apply_url: str, \
        source_id: str, last_updated: datetime, description: str):
        job = self.jobs.get_by_source_id(source_id)
        if job is None:
            return self.create_job(company, job_title, address, apply_url, source_id, last_updated, description)
        else:
            job.update(company, job_title, address, apply_url, last_updated)
            document = Document(job.id, DocumentType.JOB_DESCRIPTION, description)
            self.documents.save(document)
            self.jobs.save(job)

    def get_job_description_by_id(self, job_id: str) -> str:
        job_uuid = UUID(job_id)
        job_document = self.documents.get_by_id(job_uuid, DocumentType.JOB_DESCRIPTION)
        if job_document is None:
            raise HTTPException(status_code=404, detail="Job description not found")
        return job_document.content

    # Job Application operations
    def list_applications(self, user_id: str, limit: int = 10) -> list[JobApplication]:
        user_uuid = UUID(user_id)
        return self.applications.list_applications(user_uuid, limit=limit)
    
    def get_application_details_by_id(self, job_application_id: str):
        job_application_uuid = UUID(job_application_id)
        job_application = self.applications.get_by_id(job_application_uuid)
        coaching_report = self.documents.get_by_id(job_application_uuid, DocumentType.COACHING_REPORT)
        return {
            "job_application": job_application,
            "coaching_report": coaching_report
        }
    
    def create_application(self, user_id: str, job_id: str, \
        resume_text: str, resume_file: bytes) -> JobApplication:
        
        if resume_file is not None:
            resume_text = parse_file(resume_file)

        user_uuid = UUID(user_id)
        job = self.get_job_by_id(job_id)
        job_application = JobApplication.new(user_uuid, job)
        resume = Document(job_application.id, DocumentType.RESUME, resume_text)
        
        self.documents.save(resume)
        self.applications.save(job_application)

        return job_application

    # Coaching operations
    def create_application_analysis(self, user_id: str, job_application_id: str):
        job_application_uuid = UUID(job_application_id)
        job_application = self.applications.get_by_id(job_application_uuid)
        if job_application.user_id != UUID(user_id):
            raise HTTPException(status_code=403, detail="Forbidden")
        job_description = self.documents.get_by_id(job_application.job_id, DocumentType.JOB_DESCRIPTION)
        resume = self.documents.get_by_id(job_application.id, DocumentType.RESUME)
        
        # invoke the analyze_application
        report_text = analyze_application(resume_text=resume.content, job_description_text=job_description.content)
        
        coaching_report = Document(job_application_uuid, DocumentType.COACHING_REPORT, report_text)
        self.documents.save(coaching_report)

        return coaching_report.content
    
    def get_chat_messages(self, job_application_id: str):
        job_application_uuid = UUID(job_application_id)
        
        chat_history = self.documents.get_by_id(job_application_uuid, DocumentType.CHAT_HISTORY)
        
        return chat_history.content if chat_history is not None else "[]"
        
    def send_chat_message(self, job_application_id: str, content: str):
        job_application_uuid = UUID(job_application_id)
        
        coaching_report = self.documents.get_by_id(job_application_uuid, DocumentType.COACHING_REPORT)
        
        if coaching_report is None:
            raise HTTPException(status_code=404, detail=f"Coaching report not found for application {job_application_id}")
        
        chat_history = self.documents.get_by_id(job_application_uuid, DocumentType.CHAT_HISTORY)
        
        message_history = [] if chat_history is None else parse_chat_history(chat_history.content)
        chatbot = create_chatbot(coaching_report.content, message_history)
        
        chatbot.human_message(content)
        
        # save the updated chat history
        updated_chat_history = serialize_chat_history(chatbot.get_history())
        chat_history = Document(job_application_uuid, DocumentType.CHAT_HISTORY, updated_chat_history)
        self.documents.save(chat_history)
        
        return chat_history.content
    
