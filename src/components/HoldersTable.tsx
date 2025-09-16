import React, { useState, useMemo } from 'react';
import { TokenHolder, SortConfig } from '../types';
import { ChevronUp, ChevronDown, Search, Calendar, TrendingUp, Users } from 'lucide-react';

interface HoldersTableProps {
  holders: TokenHolder[];
  tokenSymbol?: string;
}

export const HoldersTable: React.FC<HoldersTableProps> = ({ holders, tokenSymbol = 'Token' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'rank', direction: 'asc' });

  const filteredAndSortedHolders = useMemo(() => {
    let filtered = holders.filter(holder =>
      holder.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      const aValue = a[sortConfig.field];
      const bValue = b[sortConfig.field];
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [holders, searchTerm, sortConfig]);

  const handleSort = (field: keyof TokenHolder) => {
    setSortConfig(prevConfig => ({
      field,
      direction: prevConfig.field === field && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const SortIcon = ({ field }: { field: keyof TokenHolder }) => {
    if (sortConfig.field !== field) return null;
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />;
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const getTopHolderStats = () => {
    const totalHolders = holders.length;
    const nonAMMHolders = holders.filter(h => !h.isPumpfunAMM);
    const top10Holdings = nonAMMHolders.slice(0, 10).reduce((sum, holder) => sum + holder.percentage, 0);
    const avgDaysHeld = holders.filter(h => h.daysHeld).reduce((sum, h) => sum + (h.daysHeld || 0), 0) / holders.filter(h => h.daysHeld).length;

    return { totalHolders, top10Holdings, avgDaysHeld };
  };

  const stats = getTopHolderStats();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-700">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Holders</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalHolders}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Top 10 Holdings</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.top10Holdings.toFixed(1)}%</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Avg Days Held</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {isNaN(stats.avgDaysHeld) ? 'N/A' : Math.round(stats.avgDaysHeld)}
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-6 border-b dark:border-gray-700">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search holder addresses..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                onClick={() => handleSort('rank')}
              >
                <div className="flex items-center space-x-1">
                  <span>Rank</span>
                  <SortIcon field="rank" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                onClick={() => handleSort('address')}
              >
                <div className="flex items-center space-x-1">
                  <span>Holder Address</span>
                  <SortIcon field="address" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                onClick={() => handleSort('balance')}
              >
                <div className="flex items-center space-x-1">
                  <span>Balance</span>
                  <SortIcon field="balance" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                onClick={() => handleSort('percentage')}
              >
                <div className="flex items-center space-x-1">
                  <span>Percentage</span>
                  <SortIcon field="percentage" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                onClick={() => handleSort('daysHeld')}
              >
                <div className="flex items-center space-x-1">
                  <span>Days Held</span>
                  <SortIcon field="daysHeld" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredAndSortedHolders.map((holder, index) => (
              <tr key={holder.address} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                      holder.rank <= 3 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                      holder.rank <= 10 ? 'bg-gradient-to-r from-blue-500 to-purple-600' :
                      'bg-gradient-to-r from-gray-500 to-gray-600'
                    }`}>
                      {holder.rank}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    {holder.isPumpfunAMM ? (
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                            Pump.fun AMM (SolanaM-WSOL) Market
                          </span>
                          <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                            AMM Pool
                          </span>
                        </div>
                        <div className="text-xs font-mono text-gray-500 dark:text-gray-400 mt-1">
                          {formatAddress(holder.address)}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm font-mono text-gray-900 dark:text-white">
                        {formatAddress(holder.address)}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {holder.balanceFormatted} {tokenSymbol}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {holder.balance.toLocaleString()} tokens
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {holder.percentage.toFixed(2)}%
                    </div>
                    <div className="ml-3 w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                        style={{ width: `${Math.min(holder.percentage * 5, 100)}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {holder.daysHeld ? (
                    <div>
                      <div className="font-medium">{holder.daysHeld} days</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Since {holder.firstTransactionDate?.toLocaleDateString()}
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400">N/A</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAndSortedHolders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No holders found matching your search.</p>
        </div>
      )}
    </div>
  );
};