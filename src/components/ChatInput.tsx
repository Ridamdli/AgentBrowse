import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isDarkMode: boolean;
}

function ChatInput({ onSend, isDarkMode }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Plan, search, build anything..."
        className={`w-full p-4 pr-12 rounded-lg resize-none ${
          isDarkMode
            ? 'bg-gray-700 text-white placeholder-gray-400'
            : 'bg-gray-100 text-gray-900 placeholder-gray-500'
        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        rows={3}
      />
      <button
        type="submit"
        className={`absolute right-4 bottom-4 p-2 rounded-lg ${
          message.trim()
            ? 'bg-blue-500 hover:bg-blue-600'
            : isDarkMode
            ? 'bg-gray-600'
            : 'bg-gray-300'
        } transition-colors duration-200`}
        disabled={!message.trim()}
      >
        <Send className="w-5 h-5 text-white" />
      </button>
    </form>
  );
}

export default ChatInput;