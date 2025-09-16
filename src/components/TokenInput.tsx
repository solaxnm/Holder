import React, { useState } from 'react';
import { Search, AlertCircle } from 'lucide-react';
import { solanaService } from '../services/solanaService';

interface TokenInputProps {
  onTokenSubmit: (tokenAddress: string) => void;
  loading: boolean;
}

export const TokenInput: React.FC<TokenInputProps> = ({ onTokenSubmit, loading }) => {
  const [tokenAddress, setTokenAddress] = useState('EBuTz34KVi94uoiggg8BuR5DFsDkiTM572AL2Qzepump');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!tokenAddress.trim()) {
      setError('Please enter a token address');
      return;
    }

    if (!solanaService.isValidSolanaAddress(tokenAddress)) {
      setError('Invalid Solana address format');
      return;
    }

    onTokenSubmit(tokenAddress.trim());
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Solana Token Holder Tracker
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Enter a Solana token address to view holder rankings, amounts, and holding duration
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            placeholder="Enter Solana token address (e.g., So11111111111111111111111111111111111111112)"
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            disabled={loading}
          />
        </div>
        
        {error && (
          <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? 'Loading...' : 'Analyze Token Holders'}
        </button>
      </form>
    </div>
  );
};