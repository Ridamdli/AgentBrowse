import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isDarkMode: boolean;
  isDisabled?: boolean;
}

function ChatInput({ onSendMessage, isDarkMode, isDisabled = false }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isDisabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  // Support for sending message with Ctrl+Enter or Command+Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (message.trim() && !isDisabled) {
        onSendMessage(message);
        setMessage('');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={isDisabled ? "AI is thinking..." : "Plan, search, build anything..."}
        className={`w-full p-4 pr-12 rounded-lg resize-none ${
          isDarkMode
            ? 'bg-gray-700 text-white placeholder-gray-400'
            : 'bg-gray-100 text-gray-900 placeholder-gray-500'
        } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200
          ${isDisabled ? 'opacity-70' : 'opacity-100'}`}
        rows={3}
        disabled={isDisabled}
      />
      <button
        type="submit"
        className={`absolute right-4 bottom-4 p-2 rounded-lg ${
          message.trim() && !isDisabled
            ? 'bg-blue-500 hover:bg-blue-600'
            : isDarkMode
            ? 'bg-gray-600'
            : 'bg-gray-300'
        } transition-colors duration-200`}
        disabled={!message.trim() || isDisabled}
      >
        <Send className={`w-5 h-5 ${isDisabled ? 'text-gray-400' : 'text-white'}`} />
      </button>
    </form>
  );
}

export default ChatInput;