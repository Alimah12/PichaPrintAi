from pydantic import BaseModel, EmailStr
from typing import Optional


class UserSignup(BaseModel):
    username: str
    first_name: Optional[str]
    last_name: Optional[str]
    email: EmailStr
    country: Optional[str]
    phone: Optional[str]
    password: str


class UserCreate(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = 'bearer'


class DesignCreate(BaseModel):
    input_text: str
    output_json: str


class DesignOut(BaseModel):
    id: int
    user_id: int
    input_text: str
    output_json: str
    timestamp: str

    class Config:
        from_attributes = True
