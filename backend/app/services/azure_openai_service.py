import os
import asyncio
from typing import Dict, Any, List, AsyncGenerator
from langchain_openai import AzureChatOpenAI
from browser_use import Agent
from pydantic import SecretStr
import json

class AzureOpenAIService:
    def __init__(self, api_key: str):
        """Initialize the Azure OpenAI service with an API key"""
        self.api_key = api_key
        os.environ["AZURE_OPENAI_KEY"] = api_key
    
    async def execute_task(
        self, 
        model: str, 
        task: str, 
        options: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """Execute a task using the Azure OpenAI model and return results"""
        if options is None:
            options = {}
        
        temperature = options.get("temperature", 0.0)
        api_version = options.get("api_version", "2024-10-21")
        azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
        
        # Initialize the model
        llm = AzureChatOpenAI(
            model=model,
            api_version=api_version,
            azure_endpoint=azure_endpoint,
            api_key=SecretStr(self.api_key),
            temperature=temperature
        )
        
        # Create agent with the model
        agent = Agent(
            task=task,
            llm=llm
        )
        
        results = []
        actions = []
        
        # Execute agent actions and collect results
        for step in agent.run():
            # Process step results
            results.append({
                "content": step.response,
                "type": "response"
            })
            
            # Process actions
            if step.action:
                action_data = {
                    "type": step.action.type,
                    "description": step.action.description,
                    "result": step.action.result,
                    "timestamp": step.action.timestamp.isoformat() if step.action.timestamp else None
                }
                actions.append(action_data)
                results.append({
                    "content": f"Action: {step.action.description}",
                    "type": "action",
                    "action_data": action_data
                })
        
        return {
            "results": results,
            "actions": actions,
            "task": task,
            "model": model
        }
    
    async def stream_task(
        self, 
        model: str, 
        task: str, 
        options: Dict[str, Any] = None
    ) -> AsyncGenerator[Dict[str, Any], None]:
        """Stream task execution results as they happen"""
        if options is None:
            options = {}
        
        temperature = options.get("temperature", 0.0)
        api_version = options.get("api_version", "2024-10-21")
        azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
        
        # Initialize the model
        llm = AzureChatOpenAI(
            model=model,
            api_version=api_version,
            azure_endpoint=azure_endpoint,
            api_key=SecretStr(self.api_key),
            temperature=temperature
        )
        
        # Create agent with the model
        agent = Agent(
            task=task,
            llm=llm
        )
        
        # Start the execution in a background task
        for step in agent.run():
            # Yield the response
            yield {
                "type": "response",
                "content": step.response
            }
            
            # Yield any actions
            if step.action:
                action_data = {
                    "type": step.action.type,
                    "description": step.action.description,
                    "result": step.action.result,
                    "timestamp": step.action.timestamp.isoformat() if step.action.timestamp else None
                }
                
                yield {
                    "type": "action",
                    "content": f"Action: {step.action.description}",
                    "action_type": step.action.type,
                    "action_data": action_data
                } 