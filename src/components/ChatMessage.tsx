import React from 'react';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { Message } from '../types';

interface ChatMessageProps {
  message: Message;
  isDarkMode: boolean;
}

function ChatMessage({ message, isDarkMode }: ChatMessageProps) {
  return (
    <div
      className={`flex space-x-4 ${
        message.role === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      {message.role === 'assistant' && (
        <div
          className={`p-2 rounded-lg ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`}
        >
          <Bot className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} />
        </div>
      )}
      
      <div
        className={`flex-1 max-w-3xl rounded-lg p-4 ${
          message.role === 'user'
            ? isDarkMode
              ? 'bg-blue-600 text-white'
              : 'bg-blue-500 text-white'
            : isDarkMode
            ? 'bg-gray-700 text-white'
            : 'bg-gray-200 text-gray-900'
        }`}
      >
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={`${className} bg-gray-800 rounded px-1`} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>

      {message.role === 'user' && (
        <div
          className={`p-2 rounded-lg ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`}
        >
          <User className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} />
        </div>
      )}
    </div>
  );
}

export default ChatMessage;