import os
import json
import asyncio
from typing import Any, Dict, List, Optional
from datetime import timedelta
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
    timestamp: str | None = None
    user_id: int | None
    
    class Config:
        from_attributes = True

# --- Auth Endpoints ---

@app.post("/register", response_model=UserResponse)
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

@app.post("/token", response_model=Token)
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

@app.get("/users/me", response_model=UserResponse)
async def read_users_me(current_user: UserDB = Depends(get_current_user)):
    return current_user

# Google Auth
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
        # Create user
        user = UserDB(
            email=user_google.email,
            username=user_google.email.split("@")[0], # default username
            google_id=user_google.id,
            avatar_url=user_google.picture
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        # Update info if needed
        if not user.google_id:
            user.google_id = user_google.id
        if not user.avatar_url:
            user.avatar_url = user_google.picture
        db.commit()

    # Create JWT
    access_token = create_access_token(data={"sub": user.username if user.username else user.email})
    
    # Redirect to frontend with token
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost")
    return RedirectResponse(url=f"{frontend_url}/login/callback?token={access_token}")


# --- REST Endpoints (Protected) ---

@app.get("/")
def read_root():
    return {"message": "Bienestar Docente API is running"}

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest, current_user: UserDB = Depends(get_current_user)):
    if not api_key:
        return {"response": f"Simulated AI: Hola {current_user.username}, recibí tu mensaje sobre '{request.context}'."}
    
    try:
        model = genai.GenerativeModel("gemini-flash-latest")
        system_instruction = f"Contexto: {request.context}. Usuario: {current_user.username}. Eres un asistente de bienestar docente."
        full_prompt = f"{system_instruction}\nUser: {request.message}"
        response = model.generate_content(full_prompt)
        return {"response": response.text}
    except Exception as e:
        print(f"Error calling Gemini: {e}")
        raise HTTPException(status_code=500, detail=str(e))

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
    # Only return OUR moods
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
    
    # NOTE: MCP handles async contexts differently.
    from database import SessionLocal
    db = SessionLocal()
    
    try:
        if name == "log_mood":
            mood = arguments.get("mood")
            note = arguments.get("note")
            if not mood:
                raise ValueError("Mood is required")
            
            # Using generic admin/fallback user for MCP tools since auth context isn't passed yet
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
