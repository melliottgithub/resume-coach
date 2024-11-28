import boto3
from uuid import UUID
from inject import Injector
from domain.documents import Document, DocumentRepository, DocumentType

S3_BUCKET_NAME = "resume-coach-documents"
S3_DIRECTORY = "documents"

class DocumentRepositoryImpl(DocumentRepository):
    def __init__(self):
        self.s3 = boto3.client('s3')
        self.encoding = 'utf-8'
        self.bucket_name = S3_BUCKET_NAME
        self.directory = S3_DIRECTORY
        
    def _create_key(self, document: Document) -> str:
        return f"{self.directory}/{document.document_type.value}/{document.id.hex}"
    
    def _create_key_from_id(self, id: UUID, document_type: DocumentType) -> str:
        return f"{self.directory}/{document_type.value}/{id.hex}"

    def save(self, document: Document):
        """Save a new Document to S3, or update an existing one."""
        key = self._create_key(document)
        self.s3.put_object(
            Bucket=self.bucket_name,
            Key=key,
            Body=document.content.encode(self.encoding)
        )

    def get_by_id(self, id: UUID, document_type: DocumentType) -> Document:
        """Load a Document from S3."""
        key = self._create_key_from_id(id, document_type)
        try:
            response = self.s3.get_object(Bucket=self.bucket_name, Key=key)
            content = response['Body'].read().decode(self.encoding)
            return Document(id, document_type, content)
        except self.s3.exceptions.NoSuchKey:
            return None
        
Injector.register(DocumentRepository, DocumentRepositoryImpl)