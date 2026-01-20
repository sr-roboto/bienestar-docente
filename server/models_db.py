from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from database import Base
from datetime import datetime

class UserDB(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=True) # Nullable for purely Google auth
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String, nullable=True) # Null for Google auth
    google_id = Column(String, unique=True, index=True, nullable=True)
    google_access_token = Column(String, nullable=True)
    google_refresh_token = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)

    posts = relationship("CommunityPostDB", back_populates="owner")
    moods = relationship("MoodEntryDB", back_populates="owner")

class CommunityPostDB(Base):
    __tablename__ = "community_posts"

    id = Column(Integer, primary_key=True, index=True)
    # Removing 'author' string and linking to User
    author = Column(String, index=True) # Keeping for backwards compatibility or display name
    content = Column(Text)
    likes = Column(Integer, default=0)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    owner = relationship("UserDB", back_populates="posts")

class MoodEntryDB(Base):
    __tablename__ = "mood_entries"

    id = Column(Integer, primary_key=True, index=True)
    mood = Column(String, index=True)
    note = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    owner = relationship("UserDB", back_populates="moods")
