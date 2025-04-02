import os
import asyncio
from typing import Dict, Any, List, AsyncGenerator
from langchain_openai import ChatOpenAI
from browser_use import Agent, AgentStep
import json

class OpenAIService:
    def __init__(self, api_key: str):
        """Initialize the OpenAI service with an API key"""
        self.api_key = api_key
        os.environ["OPENAI_API_KEY"] = api_key
    
    async def execute_task(
        self, 
        model: str, 
        task: str, 
        options: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """Execute a task using the OpenAI model and return results"""
        if options is None:
            options = {}
        
        temperature = options.get("temperature", 0.0)
        
        # Initialize the model
        llm = ChatOpenAI(
            model=model,
            temperature=temperature,
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
        
        # Initialize the model
        llm = ChatOpenAI(
            model=model,
            temperature=temperature,
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