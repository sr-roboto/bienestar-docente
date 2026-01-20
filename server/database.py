from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/bienestar_db")

# Handle potential difference in docker vs local if needed, but standard URL format is fine.
# If using asyncpg, URL should start with postgresql+asyncpg://
# But for simplicity with sync sqlalchemy first or standard sync usage in fastapi (which is common for simple apps)
# I will use sync psycopg2 as I added it.

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
