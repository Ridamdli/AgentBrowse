import React, { useState } from 'react';
import { Bot, LogIn, UserPlus, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AgentSelector from './components/AgentSelector';
import ChatPanel from './components/ChatPanel';
import ActionPanel from './components/ActionPanel';
import ThemeToggle from './components/ThemeToggle';
import UserDashboard from './components/UserDashboard';
import type { Message, Agent, Action } from './types';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent>({
    id: 'gpt-4o',
    name: 'GPT-4o',
    description: 'Latest OpenAI model',
    provider: 'openai',
    isMax: true
  });

  const handleSendMessage = async (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setIsThinking(true);

    // Simulate AI processing and actions
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: '```typescript\nfunction greet(name: string) {\n  return `Hello, ${name}!`;\n}\n```\n\nI\'ve created a simple TypeScript greeting function. Let me demonstrate how it works:',
        role: 'assistant',
        timestamp: new Date()
      };

      const newAction: Action = {
        id: Date.now().toString(),
        type: 'code-execution',
        description: 'Running TypeScript code',
        status: 'completed',
        result: 'Hello, User!',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setActions(prev => [...prev, newAction]);
      setIsThinking(false);
    }, 2000);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <Bot className={`w-8 h-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} />
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Bolt.new
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <AgentSelector
              selectedAgent={selectedAgent}
              onSelect={setSelectedAgent}
              isDarkMode={isDarkMode}
            />
            <div className="flex items-center space-x-2">
              <button
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  isDarkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
                onClick={() => {}}
              >
                <LogIn className="w-5 h-5" />
              </button>
              <button
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  isDarkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
                onClick={() => {}}
              >
                <UserPlus className="w-5 h-5" />
              </button>
              <button
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  isDarkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                } ${isDashboardOpen ? 'bg-blue-500 hover:bg-blue-600 text-white' : ''}`}
                onClick={() => setIsDashboardOpen(!isDashboardOpen)}
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
            <ThemeToggle isDarkMode={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chat Panel */}
          <ChatPanel
            messages={messages}
            isThinking={isThinking}
            onSendMessage={handleSendMessage}
            isDarkMode={isDarkMode}
          />

          {/* Action Panel */}
          <ActionPanel
            actions={actions}
            isDarkMode={isDarkMode}
          />

          {/* User Dashboard */}
          <AnimatePresence>
            {isDashboardOpen && (
              <UserDashboard
                isDarkMode={isDarkMode}
                onClose={() => setIsDashboardOpen(false)}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
} 