import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { Agent } from '../types';

const agents: Agent[] = [
  // OpenAI Models
  { id: 'gpt-4o', name: 'GPT-4o', description: 'Latest OpenAI model', provider: 'openai', isMax: true },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: 'Powerful OpenAI model', provider: 'openai' },
  
  // Anthropic Models
  { id: 'claude-3-5-sonnet-20240620', name: 'Claude 3.5 Sonnet', description: 'Latest Anthropic model', provider: 'anthropic', isMax: true },
  { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', description: 'Most powerful Claude model', provider: 'anthropic' },
  { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet', description: 'Balanced Claude model', provider: 'anthropic' },
  
  // Azure OpenAI
  { id: 'azure-gpt-4o', name: 'Azure GPT-4o', description: 'GPT-4o on Azure', provider: 'azure-openai' },
  
  // Google Models
  { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash', description: 'Fast Google model', provider: 'gemini' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', description: 'Powerful Google model', provider: 'gemini' },
  
  // DeepSeek Models
  { id: 'deepseek-v3', name: 'DeepSeek V3', description: 'Fast & affordable model', provider: 'deepseek' },
  { id: 'deepseek-r1', name: 'DeepSeek Reasoner', description: 'Strong reasoning capabilities', provider: 'deepseek' },
  
  // Auto-select option
  { id: 'auto', name: 'Auto-select', description: 'Best model for the task', provider: 'auto' },
];

interface AgentSelectorProps {
  selectedAgent: Agent;
  onSelect: (agent: Agent) => void;
  isDarkMode: boolean;
}

function AgentSelector({ selectedAgent, onSelect, isDarkMode }: AgentSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Group agents by provider for organized dropdown
  const groupedAgents = agents.reduce((acc, agent) => {
    if (!acc[agent.provider]) {
      acc[agent.provider] = [];
    }
    acc[agent.provider].push(agent);
    return acc;
  }, {} as Record<string, Agent[]>);

  // Provider display names
  const providerNames = {
    'openai': 'OpenAI',
    'anthropic': 'Anthropic',
    'azure-openai': 'Azure OpenAI',
    'gemini': 'Google Gemini',
    'deepseek': 'DeepSeek',
    'auto': 'Auto Select'
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
          isDarkMode
            ? 'bg-gray-700 hover:bg-gray-600 text-white'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
        } transition-colors duration-200`}
      >
        <span>{selectedAgent.name}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-64 rounded-lg shadow-lg ${
            isDarkMode ? 'bg-gray-700' : 'bg-white'
          } z-10 max-h-[500px] overflow-y-auto`}
        >
          {Object.entries(groupedAgents).map(([provider, providerAgents]) => (
            <div key={provider} className="py-2">
              {/* Provider header */}
              <div className={`px-4 py-1 text-sm font-medium ${
                isDarkMode ? 'text-gray-300' : 'text-gray-500'
              }`}>
                {providerNames[provider as keyof typeof providerNames] || provider.toUpperCase()}
              </div>
              
              {/* Provider's models */}
              {providerAgents.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => {
                    onSelect(agent);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 ${
                    isDarkMode
                      ? 'hover:bg-gray-600 text-white'
                      : 'hover:bg-gray-100 text-gray-900'
                  } transition-colors duration-200`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{agent.name}</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        {agent.description}
                      </p>
                    </div>
                    {agent.isMax && (
                      <span className="px-2 py-1 text-xs font-medium bg-blue-500 text-white rounded">
                        MAX
                      </span>
                    )}
                  </div>
                </button>
              ))}
              
              {/* Divider, except for the last group */}
              {provider !== 'auto' && (
                <div className={`mx-4 my-2 border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}></div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AgentSelector;