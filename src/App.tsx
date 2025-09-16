import React, { useState } from 'react';
import { Header } from './components/Header';
import { TokenInput } from './components/TokenInput';
import { HoldersTable } from './components/HoldersTable';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { ThemeProvider } from './hooks/useTheme';
import { TokenHolder, TokenInfo } from './types';
import { solanaService } from './services/solanaService';

function AppContent() {
  const [holders, setHolders] = useState<TokenHolder[]>([]);
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTokenSubmit = async (tokenAddress: string) => {
    setLoading(true);
    setError(null);
    setHolders([]);
    setTokenInfo(null);

    try {
      const [info, holdersList] = await Promise.all([
        solanaService.getTokenInfo(tokenAddress),
        solanaService.getTokenHolders(tokenAddress, 1000)
      ]);

      setTokenInfo({ ...info, holdersCount: holdersList.length });
      setHolders(holdersList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (tokenInfo) {
      handleTokenSubmit(tokenInfo.address);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TokenInput onTokenSubmit={handleTokenSubmit} loading={loading} />
        
        {loading && <LoadingSpinner />}
        
        {error && <ErrorMessage message={error} onRetry={handleRetry} />}
        
        {holders.length > 0 && !loading && !error && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Token Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Address</p>
                  <p className="font-mono text-sm text-gray-900 dark:text-white break-all">
                    {tokenInfo?.address}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Decimals</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {tokenInfo?.decimals}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Supply</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {tokenInfo?.totalSupply.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Holders</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {tokenInfo?.holdersCount}
                  </p>
                </div>
              </div>
            </div>
            
            <HoldersTable holders={holders} tokenSymbol={tokenInfo?.symbol} />
          </div>
        )}
        
        {holders.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Ready to Analyze Token Holders
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Enter a Solana token address above to view detailed holder analytics including rankings, amounts, and holding duration.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;