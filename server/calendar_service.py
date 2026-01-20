from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from sqlalchemy.orm import Session
from models_db import UserDB
import datetime

def get_calendar_service(user: UserDB):
    if not user.google_access_token:
        return None
    
    creds = Credentials(
        token=user.google_access_token,
        refresh_token=user.google_refresh_token,
        token_uri="https://oauth2.googleapis.com/token",
        client_id="YOUR_CLIENT_ID", # Should be env var
        client_secret="YOUR_CLIENT_SECRET" # Should be env var
    )
    
    return build('calendar', 'v3', credentials=creds)

def get_upcoming_events(user: UserDB, max_results=5):
    service = get_calendar_service(user)
    if not service:
        return []

    now = datetime.datetime.utcnow().isoformat() + 'Z'  # 'Z' indicates UTC time
    events_result = service.events().list(calendarId='primary', timeMin=now,
                                          maxResults=max_results, singleEvents=True,
                                          orderBy='startTime').execute()
    events = events_result.get('items', [])
    return events
