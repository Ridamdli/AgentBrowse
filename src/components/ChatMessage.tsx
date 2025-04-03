import React from 'react';
import { Bot, User, ChevronDown, ChevronUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { Message } from '../types';

interface ChatMessageProps {
  message: Message;
  isDarkMode: boolean;
}

function ChatMessage({ message, isDarkMode }: ChatMessageProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const hasCodeBlock = message.content.includes('```');
  const isLongMessage = message.content.length > 500;
  
  // Function to determine if message has table content
  const hasTable = message.content.includes('|') && message.content.includes('\n|-');

  return (
    <div
      className={`flex space-x-4 ${
        message.role === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      {message.role === 'assistant' && (
        <div
          className={`flex-shrink-0 p-2 rounded-lg ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`}
        >
          <Bot className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} />
        </div>
      )}
      
      <div
        className={`flex-1 max-w-3xl rounded-lg ${
          message.role === 'user'
            ? isDarkMode
              ? 'bg-blue-600 text-white'
              : 'bg-blue-500 text-white'
            : isDarkMode
            ? 'bg-gray-700 text-white'
            : 'bg-gray-200 text-gray-900'
        } ${isExpanded ? 'p-4' : 'py-2 px-4'}`}
      >
        {/* Show expand/collapse button for long or code-containing messages */}
        {(isLongMessage || hasCodeBlock || hasTable) && message.role === 'assistant' && (
          <div className="flex justify-end mb-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs flex items-center opacity-70 hover:opacity-100"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-3 h-3 mr-1" />
                  <span>Collapse</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3 mr-1" />
                  <span>Expand</span>
                </>
              )}
            </button>
          </div>
        )}
        
        {/* Message content with full markdown rendering when expanded */}
        {isExpanded ? (
          <ReactMarkdown
            components={{
              // Custom code block rendering
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <div className="rounded overflow-hidden mb-2 mt-2">
                    <div className={`text-xs px-4 py-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-300'} flex justify-between items-center`}>
                      <span>{match[1]}</span>
                    </div>
                    <SyntaxHighlighter
                      style={isDarkMode ? vscDarkPlus : vs}
                      language={match[1]}
                      PreTag="div"
                      customStyle={{
                        margin: 0,
                        borderRadius: '0 0 4px 4px',
                        fontSize: '0.9rem',
                      }}
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <code className={`${className} ${isDarkMode ? 'bg-gray-800' : 'bg-gray-300'} rounded px-1`} {...props}>
                    {children}
                  </code>
                );
              },
              
              // Enhanced table rendering
              table({ node, ...props }) {
                return (
                  <div className="overflow-x-auto my-4">
                    <table className="min-w-full border-collapse" {...props} />
                  </div>
                );
              },
              thead({ node, ...props }) {
                return <thead className={isDarkMode ? 'bg-gray-800' : 'bg-gray-300'} {...props} />;
              },
              tbody({ node, ...props }) {
                return <tbody {...props} />;
              },
              tr({ node, ...props }) {
                return <tr className={`border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`} {...props} />;
              },
              th({ node, ...props }) {
                return (
                  <th
                    className={`py-2 px-4 text-left font-medium ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}
                    {...props}
                  />
                );
              },
              td({ node, ...props }) {
                return <td className="py-2 px-4" {...props} />;
              },
              
              // Link rendering
              a({ node, ...props }) {
                return (
                  <a
                    className={`underline ${
                      isDarkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                  />
                );
              },
              
              // List styling
              ul({ node, ...props }) {
                return <ul className="list-disc pl-6 my-2" {...props} />;
              },
              ol({ node, ...props }) {
                return <ol className="list-decimal pl-6 my-2" {...props} />;
              },
              li({ node, ...props }) {
                return <li className="my-1" {...props} />;
              },
              
              // Header styling
              h1({ node, ...props }) {
                return <h1 className="text-xl font-bold my-3" {...props} />;
              },
              h2({ node, ...props }) {
                return <h2 className="text-lg font-bold my-2" {...props} />;
              },
              h3({ node, ...props }) {
                return <h3 className="text-md font-bold my-2" {...props} />;
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        ) : (
          // Show preview of message when collapsed
          <div onClick={() => setIsExpanded(true)} className="cursor-pointer">
            {message.content.substring(0, 100)}...
            <span className="text-xs ml-1 opacity-70">(Click to expand)</span>
          </div>
        )}
        
        {/* Show timestamp for messages */}
        <div className={`text-xs mt-2 text-right opacity-70`}>
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>

      {message.role === 'user' && (
        <div
          className={`flex-shrink-0 p-2 rounded-lg ${
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