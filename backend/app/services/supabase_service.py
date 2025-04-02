import os
from typing import Dict, Any, Optional, List
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

class SupabaseService:
    def __init__(self):
        supabase_url = os.getenv("VITE_SUPABASE_URL")
        supabase_key = os.getenv("VITE_SUPABASE_ANON_KEY")
        
        if not supabase_url or not supabase_key:
            raise ValueError("Supabase URL and anon key must be provided in .env file")
        
        self.client: Client = create_client(supabase_url, supabase_key)
    
    async def create_user(self, email: str, password: str) -> Optional[Dict[str, Any]]:
        try:
            response = self.client.auth.sign_up({
                "email": email,
                "password": password
            })
            
            # Create user settings record
            if response.user:
                self.client.table("user_settings").insert({
                    "user_id": response.user.id,
                    "api_keys": {},
                    "preferences": {
                        "theme": "dark",
                        "default_model": "gpt-4o",
                        "auto_select": False
                    }
                }).execute()
            
            return response.user
        except Exception as e:
            print(f"Error creating user: {str(e)}")
            return None
    
    async def authenticate_user(self, email: str, password: str) -> Optional[Dict[str, Any]]:
        try:
            response = self.client.auth.sign_in_with_password({
                "email": email,
                "password": password
            })
            
            return {
                "user": response.user,
                "access_token": response.session.access_token
            }
        except Exception as e:
            print(f"Error authenticating user: {str(e)}")
            return None
    
    async def get_user_by_token(self, token: str) -> Optional[Dict[str, Any]]:
        try:
            # Set the auth token
            self.client.auth.set_session(token)
            
            # Get the user
            user = self.client.auth.get_user()
            
            if user and user.user:
                return user.user
            return None
        except Exception as e:
            print(f"Error getting user by token: {str(e)}")
            return None
    
    async def update_user_api_key(self, user_id: str, provider: str, encrypted_key: str) -> bool:
        try:
            # Get existing settings
            settings = self.client.table("user_settings").select("*").eq("user_id", user_id).execute()
            
            if not settings.data:
                # Create settings if they don't exist
                self.client.table("user_settings").insert({
                    "user_id": user_id,
                    "api_keys": {provider: encrypted_key},
                    "preferences": {
                        "theme": "dark",
                        "default_model": "gpt-4o",
                        "auto_select": False
                    }
                }).execute()
            else:
                # Update existing settings
                current_settings = settings.data[0]
                api_keys = current_settings.get("api_keys", {})
                api_keys[provider] = encrypted_key
                
                self.client.table("user_settings").update({
                    "api_keys": api_keys
                }).eq("user_id", user_id).execute()
            
            return True
        except Exception as e:
            print(f"Error updating user API key: {str(e)}")
            return False
    
    async def check_user_api_key(self, user_id: str, provider: str) -> bool:
        try:
            settings = self.client.table("user_settings").select("api_keys").eq("user_id", user_id).execute()
            
            if not settings.data:
                return False
            
            api_keys = settings.data[0].get("api_keys", {})
            return provider in api_keys and api_keys[provider] != ""
        except Exception as e:
            print(f"Error checking user API key: {str(e)}")
            return False
    
    async def get_user_api_key(self, user_id: str, provider: str) -> Optional[str]:
        try:
            settings = self.client.table("user_settings").select("api_keys").eq("user_id", user_id).execute()
            
            if not settings.data:
                return None
            
            api_keys = settings.data[0].get("api_keys", {})
            return api_keys.get(provider)
        except Exception as e:
            print(f"Error getting user API key: {str(e)}")
            return None
    
    async def log_interaction(self, user_id: str, model: str, task: str, status: str, 
                             actions: Optional[Dict[str, Any]] = None,
                             results: Optional[Dict[str, Any]] = None) -> bool:
        try:
            self.client.table("interaction_logs").insert({
                "user_id": user_id,
                "model": model,
                "task": task,
                "status": status,
                "actions": actions,
                "results": results
            }).execute()
            return True
        except Exception as e:
            print(f"Error logging interaction: {str(e)}")
            return False 