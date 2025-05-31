from typing import List, Optional
from pydantic import BaseModel


class UserCreate(BaseModel):
    username: str
    email: str
    firstName: str
    lastName: str
    enabled: bool = True


class UserUpdate(BaseModel):
    email: Optional[str]
    firstName: Optional[str]
    lastName: Optional[str]
    enabled: Optional[bool]
