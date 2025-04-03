import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Globe, File, Eye, EyeOff, Image, Monitor, Mouse, ArrowRight } from 'lucide-react';
import type { Action } from '../types';

interface ActionPanelProps {
  actions: Action[];
  isDarkMode: boolean;
  browserScreenshots?: string[]; // URLs to browser screenshots
  liveVisualization?: boolean;
}

function ActionPanel({ actions, isDarkMode, browserScreenshots = [], liveVisualization = false }: ActionPanelProps) {
  const [showScreenshots, setShowScreenshots] = useState(true);
  const [selectedScreenshotIndex, setSelectedScreenshotIndex] = useState(browserScreenshots.length - 1);

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

  const getActionTypeLabel = (type: Action['type']) => {
    switch (type) {
      case 'web-navigation':
        return 'Browser Navigation';
      case 'code-execution':
        return 'Code Execution';
      case 'file-operation':
        return 'File Operation';
    }
  };

  // Function to render special action visualizations
  const renderActionVisualizations = (action: Action) => {
    if (action.type === 'web-navigation') {
      // Parse URL from description, if any
      const urlMatch = action.description.match(/https?:\/\/[^\s"']+/);
      const url = urlMatch ? urlMatch[0] : null;
      
      return (
        <div className="mt-3 space-y-2">
          {url && (
            <div className={`flex items-center p-2 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <Globe className="w-4 h-4 mr-2" />
              <span className="text-sm font-mono truncate">{url}</span>
            </div>
          )}
          
          {action.metadata?.actions && (
            <div className={`p-2 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <p className="text-sm mb-2 font-medium">Browser Actions:</p>
              <div className="space-y-1">
                {action.metadata.actions.map((act: any, i: number) => (
                  <div key={i} className="flex items-center text-xs">
                    {act.type === 'click' && <Mouse className="w-3 h-3 mr-1" />}
                    {act.type === 'navigate' && <ArrowRight className="w-3 h-3 mr-1" />}
                    {act.type === 'scroll' && <Monitor className="w-3 h-3 mr-1" />}
                    <span>{act.description || act.type}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="w-1/2 flex flex-col">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Action Visualization
        </h2>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowScreenshots(!showScreenshots)}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-700'
            }`}
            title={showScreenshots ? "Hide screenshots" : "Show screenshots"}
          >
            {showScreenshots ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
          
          <button 
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-700'
            } ${liveVisualization ? 'bg-green-600 text-white' : ''}`}
            title="Live Visualization Status"
          >
            <Image className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Screenshot Display Area */}
      {showScreenshots && browserScreenshots.length > 0 && (
        <div className={`p-4 border-b border-gray-700 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <div className="relative">
            <motion.div 
              key={selectedScreenshotIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full rounded-lg overflow-hidden shadow-lg"
            >
              <img 
                src={browserScreenshots[selectedScreenshotIndex]} 
                alt={`Browser screenshot ${selectedScreenshotIndex + 1}`}
                className="w-full h-auto"
              />
            </motion.div>
            
            {/* Screenshot Timeline/Navigation */}
            {browserScreenshots.length > 1 && (
              <div className="mt-3 flex items-center justify-center space-x-1">
                {browserScreenshots.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedScreenshotIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === selectedScreenshotIndex
                        ? isDarkMode ? 'bg-blue-400 w-3 h-3' : 'bg-blue-600 w-3 h-3'
                        : isDarkMode ? 'bg-gray-600' : 'bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Action Log Area */}
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
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-medium ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {action.description}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      {getActionTypeLabel(action.type)}
                    </span>
                  </div>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {action.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
              
              {/* Custom visualization based on action type */}
              {renderActionVisualizations(action)}
              
              {/* Display action result if available */}
              {action.result && (
                <div className={`mt-2 p-3 rounded ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <pre className="text-sm whitespace-pre-wrap overflow-auto max-h-40">
                    {action.result}
                  </pre>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {actions.length === 0 && (
          <div className={`text-center p-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <Monitor className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p>No actions recorded yet.</p>
            <p className="text-sm mt-1">Actions will appear here as the AI navigates the web.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ActionPanel;