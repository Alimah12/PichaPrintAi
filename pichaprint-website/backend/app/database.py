import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Read database URL from environment for deployment; default to local SQLite
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./pichaprint.db")

# SQLite requires `check_same_thread`; other databases do not
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def init_db():
    Base.metadata.create_all(bind=engine)
