from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base


class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    designs = relationship('Design', back_populates='owner')


class Design(Base):
    __tablename__ = 'designs'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    input_text = Column(Text, nullable=False)
    output_json = Column(Text, nullable=False)
    timestamp = Column(String, nullable=False)

    owner = relationship('User', back_populates='designs')
