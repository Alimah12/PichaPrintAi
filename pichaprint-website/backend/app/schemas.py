from pydantic import BaseModel
from typing import Optional


class UserCreate(BaseModel):
    email: str
    password: str


class UserOut(BaseModel):
    id: int
    email: str

    class Config:
        orm_mode = True


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
        orm_mode = True
