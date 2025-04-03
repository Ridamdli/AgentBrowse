import React, { useState, useEffect } from 'react';
import { Bot, LogIn, UserPlus, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AgentSelector from './components/AgentSelector';
import ChatPanel from './components/ChatPanel';
import ThemeToggle from './components/ThemeToggle';
import UserDashboard from './components/UserDashboard';
import type { Message, Agent, Action } from './types';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [browserScreenshots, setBrowserScreenshots] = useState<string[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent>({
    id: 'gpt-4o',
    name: 'GPT-4o',
    description: 'Latest OpenAI model',
    provider: 'openai',
    isMax: true
  });

  // Generate some sample screenshots for demonstration
  useEffect(() => {
    // These would normally come from actual browser screenshots
    const sampleScreenshots = [
      'https://placekitten.com/800/600',
      'https://picsum.photos/800/600',
      'https://source.unsplash.com/random/800x600',
    ];
    setBrowserScreenshots(sampleScreenshots);
  }, []);

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
      // Generate a more complex response with various markdown elements
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `I've analyzed your request and here's what I found:
        
## Analysis
Here's a breakdown of the search results:

| Website | Relevance | Description |
|---------|-----------|-------------|
| Example.com | High | Contains detailed information about the topic |
| Reference.org | Medium | Has some related articles and references |
| Research.edu | High | Academic papers on the subject |

### Code Example
\`\`\`typescript
function analyzeData(data: string[]): Record<string, number> {
  const result: Record<string, number> = {};
  
  for (const item of data) {
    if (result[item]) {
      result[item]++;
    } else {
      result[item] = 1;
    }
  }
  
  return result;
}

// Example usage
const data = ["apple", "banana", "apple", "orange", "banana", "apple"];
console.log(analyzeData(data));
// Output: { apple: 3, banana: 2, orange: 1 }
\`\`\`

I hope this helps! Let me know if you need further information.`,
        role: 'assistant',
        timestamp: new Date()
      };

      // Add several actions to demonstrate the action panel
      const newActions: Action[] = [
        {
          id: (Date.now()).toString(),
          type: 'web-navigation',
          description: 'Navigated to example.com',
          status: 'completed',
          result: 'Retrieved information about the topic',
          timestamp: new Date(Date.now() - 15000)
        },
        {
          id: (Date.now() + 1).toString(),
          type: 'web-navigation',
          description: 'Searched for relevant information',
          status: 'completed',
          result: 'Found 3 relevant websites',
          timestamp: new Date(Date.now() - 10000)
        },
        {
          id: (Date.now() + 2).toString(),
          type: 'code-execution',
          description: 'Running data analysis',
          status: 'completed',
          result: '{ apple: 3, banana: 2, orange: 1 }',
          timestamp: new Date(Date.now() - 5000)
        },
        {
          id: (Date.now() + 3).toString(),
          type: 'file-operation',
          description: 'Generated result summary',
          status: 'completed',
          result: 'Created markdown table with results',
          timestamp: new Date()
        }
      ];

      setMessages(prev => [...prev, aiResponse]);
      setActions(prev => [...prev, ...newActions]);
      setIsThinking(false);
    }, 3000);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="h-screen flex flex-col">
        {/* Header */}
        <header className={`flex items-center justify-between px-4 py-3 border-b ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
          <div className="flex items-center space-x-3">
            <Bot className={`w-8 h-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} />
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Browser-use AI
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
                title="Sign In"
              >
                <LogIn className="w-5 h-5" />
              </button>
              <button
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  isDarkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
                title="Create Account"
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
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
            <ThemeToggle isDarkMode={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {/* Chat and Action Panels integrated in ChatPanel */}
          <ChatPanel
            messages={messages}
            actions={actions}
            isAiThinking={isThinking}
            onSendMessage={handleSendMessage}
            isDarkMode={isDarkMode}
            browserScreenshots={browserScreenshots}
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