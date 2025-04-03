import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ActionPanel from './ActionPanel';
import { Message, Action } from '../types';
import { ArrowLeft, ArrowRight, Maximize, Minimize } from 'lucide-react';

interface ChatPanelProps {
  messages: Message[];
  actions: Action[];
  onSendMessage: (message: string) => void;
  isAiThinking: boolean;
  isDarkMode: boolean;
  browserScreenshots?: string[]; // URLs to browser screenshots
}

function ChatPanel({
  messages,
  actions,
  onSendMessage,
  isAiThinking,
  isDarkMode,
  browserScreenshots = []
}: ChatPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [splitRatio, setSplitRatio] = useState(50); // Default 50/50 split
  const [isResizing, setIsResizing] = useState(false);
  const [showFullChat, setShowFullChat] = useState(false);
  const [showFullVisualization, setShowFullVisualization] = useState(false);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle resizing the split
  const handleResize = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isResizing) {
      const container = e.currentTarget.parentElement;
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const newRatio = ((e.clientX - containerRect.left) / containerRect.width) * 100;
        setSplitRatio(Math.max(20, Math.min(80, newRatio))); // Limit between 20% and 80%
      }
    }
  };

  // Determine whether we should show real-time visualization
  const hasRecentAction = actions.length > 0 && 
    (new Date().getTime() - new Date(actions[actions.length - 1].timestamp).getTime()) < 30000; // Within last 30 seconds

  // CSS for typing indicator
  const typingIndicatorStyle = `
    .typing-indicator {
      display: flex;
      align-items: center;
    }
    .typing-indicator span {
      height: 8px;
      width: 8px;
      margin: 0 1px;
      background-color: ${isDarkMode ? '#d1d5db' : '#4b5563'};
      border-radius: 50%;
      display: inline-block;
      animation: typing-animation 1.4s infinite ease-in-out both;
    }
    .typing-indicator span:nth-child(1) {
      animation-delay: -0.32s;
    }
    .typing-indicator span:nth-child(2) {
      animation-delay: -0.16s;
    }
    @keyframes typing-animation {
      0%, 80%, 100% { transform: scale(0.6); opacity: 0.6; }
      40% { transform: scale(1); opacity: 1; }
    }
  `;

  return (
    <div 
      className="h-full flex flex-col"
      onMouseMove={handleResize}
      onMouseUp={() => setIsResizing(false)}
      onMouseLeave={() => setIsResizing(false)}
    >
      <div className="flex-1 flex overflow-hidden">
        {/* CHAT PANEL - left side */}
        <div 
          className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} overflow-y-auto transition-all duration-300 ease-in-out`}
          style={{ 
            width: showFullVisualization ? '0%' : showFullChat ? '100%' : `${splitRatio}%`, 
            display: showFullVisualization ? 'none' : 'block' 
          }}
        >
          <div className="flex justify-between items-center p-2 border-b border-gray-700">
            <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Chat
            </h2>
            <button 
              onClick={() => setShowFullChat(!showFullChat)}
              className={`p-1 rounded hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
            >
              {showFullChat ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
          </div>
          
          <div className="p-4 space-y-6">
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message} isDarkMode={isDarkMode} />
            ))}
            <div ref={messagesEndRef} />
            
            {isAiThinking && (
              <div
                className={`flex items-center space-x-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span>AI is thinking...</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Resizer handle */}
        {!showFullChat && !showFullVisualization && (
          <div 
            className={`w-1 cursor-ew-resize ${isDarkMode ? 'bg-gray-700 hover:bg-blue-600' : 'bg-gray-300 hover:bg-blue-400'} active:bg-blue-500 transition-colors duration-150`}
            onMouseDown={() => setIsResizing(true)}
          ></div>
        )}
        
        {/* VISUALIZATION PANEL - right side */}
        <div 
          className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} overflow-auto transition-all duration-300 ease-in-out`}
          style={{ 
            width: showFullChat ? '0%' : showFullVisualization ? '100%' : `${100 - splitRatio}%`,
            display: showFullChat ? 'none' : 'block'
          }}
        >
          <div className="flex justify-between items-center p-2 border-b border-gray-700">
            <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Visualization
            </h2>
            <div className="flex space-x-2">
              <button 
                onClick={() => setShowFullVisualization(!showFullVisualization)}
                className={`p-1 rounded hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
              >
                {showFullVisualization ? <Minimize size={18} /> : <Maximize size={18} />}
              </button>
            </div>
          </div>
          
          <div className="p-2">
            <ActionPanel 
              actions={actions} 
              isDarkMode={isDarkMode} 
              browserScreenshots={browserScreenshots}
              liveVisualization={hasRecentAction}
            />
          </div>
        </div>
      </div>
      
      {/* Chat input at bottom */}
      <div className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}>
        <ChatInput onSendMessage={onSendMessage} isDarkMode={isDarkMode} isDisabled={isAiThinking} />
      </div>

      {/* Add CSS for typing indicator */}
      <style dangerouslySetInnerHTML={{ __html: typingIndicatorStyle }} />
    </div>
  );
}

export default ChatPanel;