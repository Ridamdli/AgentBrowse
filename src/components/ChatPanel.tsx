import React from 'react';
import { motion } from 'framer-motion';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import type { Message } from '../types';

interface ChatPanelProps {
  messages: Message[];
  isThinking: boolean;
  onSendMessage: (content: string) => void;
  isDarkMode: boolean;
}

function ChatPanel({ messages, isThinking, onSendMessage, isDarkMode }: ChatPanelProps) {
  return (
    <div className="w-1/2 flex flex-col border-r border-gray-700">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            isDarkMode={isDarkMode}
          />
        ))}
        
        {isThinking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`flex items-center space-x-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            <div className="flex space-x-1">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatDelay: 0.2,
                }}
                className={`w-2 h-2 rounded-full ${
                  isDarkMode ? 'bg-blue-400' : 'bg-blue-600'
                }`}
              />
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatDelay: 0.2,
                  delay: 0.2,
                }}
                className={`w-2 h-2 rounded-full ${
                  isDarkMode ? 'bg-blue-400' : 'bg-blue-600'
                }`}
              />
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatDelay: 0.2,
                  delay: 0.4,
                }}
                className={`w-2 h-2 rounded-full ${
                  isDarkMode ? 'bg-blue-400' : 'bg-blue-600'
                }`}
              />
            </div>
            <span className="text-sm">AI is thinking...</span>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-700">
        <ChatInput onSend={onSendMessage} isDarkMode={isDarkMode} />
      </div>
    </div>
  );
}

export default ChatPanel;