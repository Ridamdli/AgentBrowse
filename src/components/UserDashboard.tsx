import React from 'react';
import { motion } from 'framer-motion';
import { X, Key, History, Settings as SettingsIcon } from 'lucide-react';

interface UserDashboardProps {
  isDarkMode: boolean;
  onClose: () => void;
}

function UserDashboard({ isDarkMode, onClose }: UserDashboardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className={`fixed right-0 top-0 h-full w-96 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-xl z-50 overflow-y-auto`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Dashboard
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              isDarkMode
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* API Keys Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Key className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              API Keys
            </h3>
          </div>
          <div className={`space-y-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <div className="space-y-2">
              <label className="block text-sm font-medium">OpenAI API Key</label>
              <input
                type="password"
                className={`w-full px-3 py-2 rounded-lg ${
                  isDarkMode
                    ? 'bg-gray-700 text-white border-gray-600'
                    : 'bg-gray-100 text-gray-900 border-gray-300'
                } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter OpenAI API key"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Anthropic API Key</label>
              <input
                type="password"
                className={`w-full px-3 py-2 rounded-lg ${
                  isDarkMode
                    ? 'bg-gray-700 text-white border-gray-600'
                    : 'bg-gray-100 text-gray-900 border-gray-300'
                } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter Anthropic API key"
              />
            </div>
          </div>
        </div>

        {/* Chat History */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <History className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Recent Chats
            </h3>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((_, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                  isDarkMode
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Chat Session #{index + 1}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <SettingsIcon className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Preferences
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>Auto-select AI Model</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>Save Chat History</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default UserDashboard;