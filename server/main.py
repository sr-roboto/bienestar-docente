import os
import json
import asyncio
from typing import Any, Dict, List, Optional
from datetime import timedelta, datetime
from fastapi import FastAPI, HTTPException, Depends, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, RedirectResponse
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Session
import google.generativeai as genai
from dotenv import load_dotenv

# Database
from database import engine, get_db, Base
from models_db import CommunityPostDB, MoodEntryDB, UserDB

# Auth
from auth import (
    get_password_hash, 
    verify_password, 
    create_access_token, 
    get_current_user, 
    ACCESS_TOKEN_EXPIRE_MINUTES
)
from google_auth import google_sso
from calendar_service import get_upcoming_events, create_event

# MCP
from mcp.server import Server
from mcp.server.sse import SseServerTransport
from mcp.types import Tool, TextContent, ImageContent, EmbeddedResource
import mcp.types as types

load_dotenv()

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Bienestar Docente API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini
api_key = os.getenv("GOOGLE_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

# --- Pydantic Models for API ---

class UserCreate(BaseModel):
    username: str
    password: str
    email: str

class UserResponse(BaseModel):
    id: int
    username: str | None
    email: str | None
    avatar_url: str | None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class ChatRequest(BaseModel):
    message: str
    context: str = "general"

class CommunityPostCreate(BaseModel):
    content: str
    author: str | None = None 

class CommunityPostResponse(BaseModel):
    id: int
    author: str | None
    content: str
    likes: int
    user_id: int | None
    
    class Config:
        from_attributes = True

class MoodEntryCreate(BaseModel):
    mood: str
    note: str | None = None

class MoodEntryResponse(MoodEntryCreate):
    id: int
    timestamp: datetime | str | None = None
    user_id: int | None
    
    class Config:
        from_attributes = True

class CalendarEventResponse(BaseModel):
    id: str | None = None
    summary: str | None = None
    start: str | None = None
    end: str | None = None
    link: str | None = None

# --- Auth Endpoints ---

@app.post("/api/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(UserDB).filter((UserDB.username == user.username) | (UserDB.email == user.email)).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username or email already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = UserDB(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/api/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.username == form_data.username).first()
    if not user:
         # Try email login
         user = db.query(UserDB).filter(UserDB.email == form_data.username).first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username if user.username else user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/users/me", response_model=UserResponse)
async def read_users_me(current_user: UserDB = Depends(get_current_user)):
    return current_user

# Google Auth (Keep at root for consistency with Google Console settings)
@app.get("/auth/google")
async def google_login():
    """Redirects user to Google Login"""
    return await google_sso.get_login_redirect()

@app.get("/auth/google/callback")
async def google_callback(request: Request, db: Session = Depends(get_db)):
    """Handle callback from Google"""
    try:
        user_google = await google_sso.verify_and_process(request)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Google Auth Error: {e}")

    # Check if user exists
    user = db.query(UserDB).filter(UserDB.email == user_google.email).first()
    
    if not user:
        user = UserDB(
            email=user_google.email,
            username=user_google.email.split("@")[0],
            google_id=user_google.id,
            avatar_url=user_google.picture
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        if not user.google_id:
            user.google_id = user_google.id
        if not user.avatar_url:
            user.avatar_url = user_google.picture
        db.commit()
    
    # Store access tokens if available (Not directly provided by fast-sso verify object standardized, 
    # but we might get them if we requested them. 
    # For now, we assume user might need to re-auth or we use what we have. 
    # Note: google-auth-oauthlib flow is better for offline access, but simple SSO is okay for now.)

    access_token = create_access_token(data={"sub": user.username if user.username else user.email})
    
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost")
    return RedirectResponse(url=f"{frontend_url}/login/callback?token={access_token}")


# --- REST Endpoints (Protected) ---

@app.get("/")
def read_root():
    return {"message": "Bienestar Docente API is running"}

# Gemini Tools Definition
def create_calendar_event_tool(summary: str, start_time: str, end_time: str):
    """Schedules an event in the user's Google Calendar.
    
    Args:
        summary: The title of the event.
        start_time: ISO format start time (e.g. 2023-10-27T10:00:00).
        end_time: ISO format end time.
    """
    # This function body is just for the Tool definition signature, 
    # the actual logic is executed when the model asks for it.
    pass

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest, current_user: UserDB = Depends(get_current_user)):
    if not api_key:
        return {"response": f"Simulated AI: Hola {current_user.username}."}
    
    try:
        model = genai.GenerativeModel("gemini-flash-latest", tools=[create_calendar_event_tool])
        chat = model.start_chat(enable_automatic_function_calling=True)
        
        # We need to manually handle the function call if we want to inject the USER context
        # But 'enable_automatic_function_calling' tries to run it. 
        # Since 'create_calendar_event_tool' is bound to the local scope here WITHOUT the user context,
        # it won't work automatically if it needs 'current_user'.
        # Solution: Define the function wrapper that HAS access to current_user.
        
        def create_event_wrapper(summary: str, start_time: str, end_time: str):
            # Basic validation
            return create_event(current_user, summary, start_time, end_time)

        # Re-configure tools with the callable that has closure over current_user
        # Gemini Python SDK 'tools' argument usually takes functions. 
        # If we want automatic execution, we pass the function map.
        
        # Simplified approach: Disable auto-execution, handle manually?
        # Or Just use context.
        
        # Better approach for this demo:
        # We will use the model to generate the TOOL CALL, then we execute it manually.
        
        model = genai.GenerativeModel("gemini-flash-latest") # No tools init here to keep it simple first? 
        # No, we need tools.
        
        tools_map = {
            'create_calendar_event_tool': create_event_wrapper
        }
        
        # We can't easily pass the wrapper to definitions if signatures don't match exactly or docstrings are missing.
        # Let's use the manual turn-by-turn.
        
        model = genai.GenerativeModel("gemini-flash-latest", tools=[create_calendar_event_tool])
        chat = model.start_chat()
        
        system_instruction = f"Contexto: {request.context}. Usuario: {current_user.username}. Eres un asistente útil. Tienes herramientas para agendar en Google Calendar. Si el usuario pide agendar, usa la herramienta. Hoy es {datetime.now().isoformat()}."
        full_prompt = f"{system_instruction}\nUser: {request.message}"
        
        response = chat.send_message(full_prompt)
        
        # Check for function call
        if response.candidates[0].content.parts[0].function_call:
            fc = response.candidates[0].content.parts[0].function_call
            if fc.name == "create_calendar_event_tool":
                args = fc.args
                result = create_event(current_user, args['summary'], args['start_time'], args['end_time'])
                
                # Send result back
                response = chat.send_message(
                    genai.protos.Content(
                        parts=[genai.protos.Part(
                            function_response=genai.protos.FunctionResponse(
                                name="create_calendar_event_tool",
                                response={"result": f"Event created: {result}"}
                            )
                        )]
                    )
                )
                return {"response": response.text}

        return {"response": response.text}

    except Exception as e:
        print(f"Error calling Gemini: {e}")
        # raise HTTPException(status_code=500, detail=str(e))
        return {"response": f"Lo siento, hubo un error técnico: {str(e)}"}

@app.get("/api/calendar", response_model=List[CalendarEventResponse])
def get_calendar(db: Session = Depends(get_db), current_user: UserDB = Depends(get_current_user)):
    events = get_upcoming_events(current_user)
    # Transform to response model
    res = []
    for e in events:
        start = e['start'].get('dateTime', e['start'].get('date'))
        end = e['end'].get('dateTime', e['end'].get('date'))
        res.append(CalendarEventResponse(
            id=e['id'],
            summary=e.get('summary', 'No Title'),
            start=start,
            end=end,
            link=e.get('htmlLink')
        ))
    return res

@app.get("/api/community", response_model=List[CommunityPostResponse])
def get_community_posts(db: Session = Depends(get_db), current_user: UserDB = Depends(get_current_user)):
    posts = db.query(CommunityPostDB).all()
    return posts

@app.post("/api/community", response_model=CommunityPostResponse)
def create_post(post: CommunityPostCreate, db: Session = Depends(get_db), current_user: UserDB = Depends(get_current_user)):
    db_post = CommunityPostDB(
        content=post.content,
        author=post.author if post.author else current_user.username,
        user_id=current_user.id
    )
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

@app.get("/api/mood", response_model=List[MoodEntryResponse])
def get_moods(db: Session = Depends(get_db), current_user: UserDB = Depends(get_current_user)):
    moods = db.query(MoodEntryDB).filter(MoodEntryDB.user_id == current_user.id).all()
    return list(map(format_mood, moods))

def format_mood(mood_db):
    m = MoodEntryResponse.model_validate(mood_db)
    if mood_db.timestamp:
        m.timestamp = mood_db.timestamp.isoformat()
    return m

@app.post("/api/mood", response_model=MoodEntryResponse)
def log_mood(entry: MoodEntryCreate, db: Session = Depends(get_db), current_user: UserDB = Depends(get_current_user)):
    db_entry = MoodEntryDB(
        mood=entry.mood, 
        note=entry.note,
        user_id=current_user.id
    )
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return format_mood(db_entry)


# --- MCP Server Implementation ---

mcp_server = Server("bienestar-docente-mcp")

@mcp_server.list_tools()
async def handle_list_tools() -> list[types.Tool]:
    return [
        types.Tool(
            name="log_mood",
            description="Log a user's mood and optional note.",
            inputSchema={
                "type": "object",
                "properties": {
                    "mood": {"type": "string", "description": "The mood (happy, stressed, etc)"},
                    "note": {"type": "string", "description": "Optional note about the mood"}
                },
                "required": ["mood"]
            }
        ),
        types.Tool(
            name="get_latest_posts",
            description="Get the latest community posts.",
            inputSchema={
                "type": "object",
                "properties": {},
            }
        )
    ]

@mcp_server.call_tool()
async def handle_call_tool(
    name: str, arguments: dict | None
) -> list[types.TextContent | types.ImageContent | types.EmbeddedResource]:
    
    from database import SessionLocal
    db = SessionLocal()
    try:
        if name == "log_mood":
            mood = arguments.get("mood")
            note = arguments.get("note")
            if not mood:
                raise ValueError("Mood is required")
            
            # Use generic admin for MCP
            user = db.query(UserDB).first()
            user_id = user.id if user else None

            db_entry = MoodEntryDB(mood=mood, note=note, user_id=user_id)
            db.add(db_entry)
            db.commit()
            return [types.TextContent(type="text", text=f"Mood '{mood}' logged successfully.")]

        elif name == "get_latest_posts":
            posts = db.query(CommunityPostDB).order_by(CommunityPostDB.id.desc()).limit(5).all()
            text = "\n".join([f"- {p.author}: {p.content}" for p in posts])
            return [types.TextContent(type="text", text=f"Latest posts:\n{text}")]
            
        else:
            raise ValueError(f"Unknown tool: {name}")
            
    finally:
        db.close()

# SSE Endpoint for MCP
sse_transport = SseServerTransport("/sse")

@app.get("/sse")
async def handle_sse(request: Request):
    async with sse_transport.connect_sse(
        request.scope, request.receive, request._send
    ) as streams:
        await mcp_server.run(
            streams[0], streams[1], mcp_server.create_initialization_options()
        )

@app.post("/sse")
async def handle_sse_post(request: Request):
    await sse_transport.handle_post_message(request.scope, request.receive, request._send)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
