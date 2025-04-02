from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict, Any

class User(BaseModel):
    email: EmailStr
    password: str
    name: Optional[str] = None

class ApiKeyUpdate(BaseModel):
    provider: str = Field(..., description="The API provider name (e.g., 'openai', 'anthropic')")
    api_key: str = Field(..., description="The API key to store")

class UserSettings(BaseModel):
    user_id: str
    api_keys: Dict[str, str] = {}
    preferences: Dict[str, Any] = {
        "theme": "dark",
        "default_model": "gpt-4o",
        "auto_select": False
    }

class InteractionLog(BaseModel):
    user_id: str
    model: str
    task: str
    status: str
    timestamp: Optional[str] = None  # Will be set by the database
    actions: Optional[Dict[str, Any]] = None
    results: Optional[Dict[str, Any]] = None 