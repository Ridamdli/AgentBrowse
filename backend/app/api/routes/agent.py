from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect, status
from fastapi.security import OAuth2PasswordBearer
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from app.services.supabase_service import SupabaseService
from app.services.encryption_service import EncryptionService
from app.services.openai_service import OpenAIService
from app.services.anthropic_service import AnthropicService
from app.services.azure_openai_service import AzureOpenAIService
from app.services.gemini_service import GeminiService
from app.services.deepseek_service import DeepSeekService
import json
import os
from dotenv import load_dotenv

router = APIRouter()
supabase_service = SupabaseService()
encryption_service = EncryptionService()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/token")

class TaskRequest(BaseModel):
    model: str  # "gpt-4o", "claude-3.5", etc.
    task: str
    options: Optional[Dict[str, Any]] = None

class AgentResponse(BaseModel):
    type: str  # "thinking", "response", "action", "error"
    content: str
    action_type: Optional[str] = None
    action_data: Optional[Dict[str, Any]] = None

# Helper function to determine provider from model name
def get_provider_from_model(model: str) -> str:
    if model.startswith(("gpt", "text-davinci")):
        return "openai"
    elif model.startswith("claude"):
        return "anthropic"
    elif model.startswith("gemini"):
        return "gemini"
    elif model.startswith("deepseek"):
        return "deepseek"
    elif model.startswith("azure-"):
        return "azure-openai"
    else:
        return "unknown"

@router.post("/execute")
async def execute_task(task_data: TaskRequest, token: str = Depends(oauth2_scheme)):
    # Get the user from the token
    user = await supabase_service.get_user_by_token(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    
    # Determine provider based on model
    provider = get_provider_from_model(task_data.model)
    
    if provider == "unknown":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported model: {task_data.model}"
        )
    
    # Check if user has required API key
    has_key = await supabase_service.check_user_api_key(user["id"], provider)
    if not has_key:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"{provider.capitalize()} API key required",
            headers={"X-Error-Code": "missing_api_key", "X-Provider": provider}
        )
    
    # Get and decrypt API key
    encrypted_key = await supabase_service.get_user_api_key(user["id"], provider)
    api_key = encryption_service.decrypt(encrypted_key)
    
    # Execute task with appropriate service
    service = None
    if provider == "openai":
        service = OpenAIService(api_key)
    elif provider == "anthropic":
        service = AnthropicService(api_key)
    elif provider == "azure-openai":
        service = AzureOpenAIService(api_key)
    elif provider == "gemini":
        service = GeminiService(api_key)
    elif provider == "deepseek":
        service = DeepSeekService(api_key)
    
    results = await service.execute_task(task_data.model, task_data.task, task_data.options)
    
    return results

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    
    try:
        # First message should be authentication token
        auth_msg = await websocket.receive_text()
        auth_data = json.loads(auth_msg)
        
        if "token" not in auth_data:
            await websocket.send_json({
                "type": "error",
                "content": "Authentication required"
            })
            await websocket.close()
            return
        
        # Verify token and get user
        user = await supabase_service.get_user_by_token(auth_data["token"])
        if not user:
            await websocket.send_json({
                "type": "error",
                "content": "Invalid authentication"
            })
            await websocket.close()
            return
        
        # Send authentication success
        await websocket.send_json({
            "type": "system",
            "content": "Authentication successful"
        })
        
        # Process messages
        async for message in websocket.iter_text():
            data = json.loads(message)
            
            if "task" not in data or "model" not in data:
                await websocket.send_json({
                    "type": "error",
                    "content": "Invalid request format"
                })
                continue
            
            # Determine provider based on model
            provider = get_provider_from_model(data["model"])
            
            if provider == "unknown":
                await websocket.send_json({
                    "type": "error",
                    "content": f"Unsupported model: {data['model']}"
                })
                continue
            
            # Check if user has required API key
            has_key = await supabase_service.check_user_api_key(user["id"], provider)
            
            if not has_key:
                await websocket.send_json({
                    "type": "error",
                    "content": f"{provider.capitalize()} API key required",
                    "require_action": "api_key_input",
                    "provider": provider
                })
                continue
            
            # Get and decrypt API key
            encrypted_key = await supabase_service.get_user_api_key(user["id"], provider)
            api_key = encryption_service.decrypt(encrypted_key)
            
            # Send thinking status
            await websocket.send_json({
                "type": "thinking",
                "content": f"Processing your request with {data['model']}..."
            })
            
            # Initialize appropriate service
            service = None
            if provider == "openai":
                service = OpenAIService(api_key)
            elif provider == "anthropic":
                service = AnthropicService(api_key)
            elif provider == "azure-openai":
                service = AzureOpenAIService(api_key)
            elif provider == "gemini":
                service = GeminiService(api_key)
            elif provider == "deepseek":
                service = DeepSeekService(api_key)
            
            # Stream the response
            async for result in service.stream_task(data["model"], data["task"], data.get("options", {})):
                await websocket.send_json(result)
            
            # Log the interaction to the database
            await supabase_service.log_interaction(
                user_id=user["id"],
                model=data["model"],
                task=data["task"],
                status="completed"
            )
                
    except WebSocketDisconnect:
        print(f"WebSocket disconnected")
    except Exception as e:
        print(f"WebSocket error: {str(e)}")
        try:
            await websocket.send_json({
                "type": "error",
                "content": str(e)
            })
        except:
            pass 