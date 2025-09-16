import React from 'react';
import { Moon, Sun, ExternalLink, Zap } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { solanaService } from '../services/solanaService';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const currentEndpoint = solanaService.getCurrentEndpoint();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Token Holders
              </h1></div>
              <br/>
              <p>by <a href="https://solanam.com/" className="text-purple-500" target="_blank">SolanaM</a></p>
            
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Zap className="h-4 w-4 text-green-500" />
              <span>{currentEndpoint.name}</span>
              {currentEndpoint.latency && (
                <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                  {currentEndpoint.latency}ms
                </span>
              )}
            </div>

            <a href="https://github.com/solaxnm/holders" className="text-purple-500" target="_blank">
              <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200">
                GitHub Repo
                <ExternalLink className="h-5 w-5" />
              </button>
            </a>

            
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};