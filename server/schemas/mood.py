from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class MoodEntryCreate(BaseModel):
    mood: str
    note: Optional[str] = None


class MoodEntryResponse(BaseModel):
    id: int
    timestamp: Optional[datetime | str] = None
    user_id: Optional[int]

    class Config:
        from_attributes = True
