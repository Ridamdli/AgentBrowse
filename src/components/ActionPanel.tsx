import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Globe, File } from 'lucide-react';
import type { Action } from '../types';

interface ActionPanelProps {
  actions: Action[];
  isDarkMode: boolean;
}

function ActionPanel({ actions, isDarkMode }: ActionPanelProps) {
  const getActionIcon = (type: Action['type']) => {
    switch (type) {
      case 'web-navigation':
        return <Globe className="w-5 h-5" />;
      case 'code-execution':
        return <Code className="w-5 h-5" />;
      case 'file-operation':
        return <File className="w-5 h-5" />;
    }
  };

  return (
    <div className="w-1/2 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Action Visualization
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence>
          {actions.map((action) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-4 p-4 rounded-lg ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-lg`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className={`p-2 rounded-lg ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  {getActionIcon(action.type)}
                </div>
                <div>
                  <h3 className={`font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {action.description}
                  </h3>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {action.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
              
              {action.result && (
                <div className={`mt-2 p-3 rounded ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <pre className="text-sm whitespace-pre-wrap">
                    {action.result}
                  </pre>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ActionPanel;