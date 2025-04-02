import React from 'react';
import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

function ThemeToggle({ isDarkMode, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`p-2 rounded-lg transition-colors duration-200 ${
        isDarkMode
          ? 'bg-gray-700 hover:bg-gray-600 text-white'
          : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
      }`}
    >
      {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}

export default ThemeToggle;