import uuid
from uuid import UUID
from dataclasses import dataclass
from typing import List, Optional
import bcrypt
from abc import ABC, abstractmethod

def encrypt_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode(), salt)
    return hashed.decode()

def authenticate_password(stored_password: str, provided_password: str) -> bool:
    return bcrypt.checkpw(provided_password.encode(), stored_password.encode())

@dataclass
class User:
    id: UUID
    name: str
    email: str
    password: str
    
    @classmethod
    def new(cls, name: str, email: str, password: str) -> "User":
        encrypted_password = encrypt_password(password)
        
        return cls(
            id=uuid.uuid4(),
            name=name,
            email=email,
            password=encrypted_password
        )

    def authenticate(self, password: str) -> bool:
        return authenticate_password(self.password, password)

class UserRepository(ABC):
    @abstractmethod
    def save(self, user: User) -> None:
        pass

    @abstractmethod
    def get_by_id(self, user_id: str) -> User:
        pass

    @abstractmethod
    def update(self, user: User) -> None:
        pass

    @abstractmethod
    def delete_by_id(self, user_id: str) -> None:
        pass

    @abstractmethod
    def get_by_email(self, email: str) -> User:
        pass
