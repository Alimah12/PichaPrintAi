import os
from urllib.parse import urlparse
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import sys

# Read database URL from environment for deployment; default to local SQLite
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./pichaprint.db")

# Determine connect args based on DB type
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
else:
    # For Postgres on some hosts (Render) require SSL; if sslmode not present, add it
    parsed = urlparse(DATABASE_URL)
    if parsed.scheme.startswith("postgres"):
        if "sslmode" not in DATABASE_URL:
            connect_args = {"sslmode": "require"}


# Create engine and session
try:
    engine = create_engine(DATABASE_URL, connect_args=connect_args)
except Exception as e:
    print("Failed to create DB engine:", e, file=sys.stderr)
    raise

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def init_db():
    try:
        Base.metadata.create_all(bind=engine)
        print("Database tables created/checked (create_all executed)")
    except Exception as e:
        print("Error creating tables:", e, file=sys.stderr)
        raise
