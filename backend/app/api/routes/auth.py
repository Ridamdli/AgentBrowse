from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import Optional, Dict
from app.services.supabase_service import SupabaseService
from app.services.encryption_service import EncryptionService
from app.models.user import User, ApiKeyUpdate
import os
from dotenv import load_dotenv, set_key

router = APIRouter()
supabase_service = SupabaseService()
encryption_service = EncryptionService()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/token")

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: str

class LoginResponse(BaseModel):
    token: Token
    has_openai_key: bool

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await supabase_service.authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return {
        "access_token": user["access_token"],
        "token_type": "bearer",
        "user_id": user["user"]["id"]
    }

@router.post("/signup")
async def signup(user: User):
    result = await supabase_service.create_user(user.email, user.password)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User registration failed"
        )
    return {"message": "User registered successfully"}

@router.get("/me")
async def get_current_user(token: str = Depends(oauth2_scheme)):
    user = await supabase_service.get_user_by_token(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

@router.post("/api-keys")
async def update_api_key(
    api_key_data: ApiKeyUpdate,
    token: str = Depends(oauth2_scheme)
):
    user = await supabase_service.get_user_by_token(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    
    # Encrypt the API key before storing
    encrypted_key = encryption_service.encrypt(api_key_data.api_key)
    
    # Update the user's API key in the database
    success = await supabase_service.update_user_api_key(
        user["id"], 
        api_key_data.provider, 
        encrypted_key
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update API key"
        )
    
    # For development, also update the .env file
    # In production, this would be handled differently
    env_path = os.path.join(os.getcwd(), '.env')
    env_var_name = f"{api_key_data.provider.upper()}_API_KEY"
    
    try:
        # Load existing .env file or create if it doesn't exist
        if not os.path.exists(env_path):
            with open(env_path, 'w') as f:
                f.write(f"{env_var_name}={api_key_data.api_key}\n")
        else:
            set_key(env_path, env_var_name, api_key_data.api_key)
            load_dotenv(override=True)  # Reload environment variables
    except Exception as e:
        # Log the error but don't fail the request since the key is in the database
        print(f"Error updating .env file: {str(e)}")
    
    return {"message": f"{api_key_data.provider} API key updated successfully"}

@router.get("/api-keys/{provider}")
async def check_api_key(
    provider: str,
    token: str = Depends(oauth2_scheme)
):
    user = await supabase_service.get_user_by_token(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    
    has_key = await supabase_service.check_user_api_key(user["id"], provider)
    
    return {"has_key": has_key} 