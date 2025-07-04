import { useState, useEffect } from 'react'
import { useWallet } from '../../hooks/useWalletContext'
import { useDelegation } from '../../hooks/useDelegation'
import { useSupabase } from '../../hooks/useSupabase'
import { getStewardByAddress } from '../../data/stewards'
import type { DelegationRecord } from '../../types'
import { 
  History, 
  ExternalLink, 
  Download,
  Search,
  Calendar,
  TrendingUp,
  TrendingDown,
  RefreshCw
} from 'lucide-react'

const HistoryPage = () => {
  const { walletState } = useWallet()
  const { delegationHistory, loadDelegationHistory } = useDelegation(null, walletState.address)
  const { isLoading: supabaseLoading } = useSupabase(walletState.address)
  const [filteredHistory, setFilteredHistory] = useState<DelegationRecord[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'delegate' | 'undelegate'>('all')
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const refreshHistory = async () => {
    if (!walletState.address) return
    setIsRefreshing(true)
    try {
      await loadDelegationHistory()
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    let filtered = [...delegationHistory]

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(record => record.type === filterType)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(record => 
        record.delegatee.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (getStewardByAddress(record.delegatee)?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort by timestamp
    filtered.sort((a, b) => {
      return sortOrder === 'desc' 
        ? b.timestamp - a.timestamp 
        : a.timestamp - b.timestamp
    })

    setFilteredHistory(filtered)
  }, [delegationHistory, searchTerm, filterType, sortOrder])

  const formatAddress = (address: string) => {
    if (address === '0x0000000000000000000000000000000000000000') {
      return 'Undelegated'
    }
    const steward = getStewardByAddress(address)
    return steward?.name || `${address.slice(0, 8)}...${address.slice(-6)}`
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  const exportHistory = () => {
    const csvContent = [
      ['Date', 'Type', 'Delegate', 'Transaction Hash'].join(','),
      ...filteredHistory.map(record => [
        new Date(record.timestamp).toISOString(),
        record.type,
        formatAddress(record.delegatee),
        record.transactionHash || ''
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.setAttribute('hidden', '')
    a.setAttribute('href', url)
    a.setAttribute('download', `delegation-history-${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const stats = {
    total: delegationHistory.length,
    delegations: delegationHistory.filter(r => r.type === 'delegate').length,
    undelegations: delegationHistory.filter(r => r.type === 'undelegate').length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Delegation History</h1>
          <p className="text-gray-400">Complete record of your delegation activities</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={refreshHistory}
            disabled={isRefreshing || supabaseLoading}
            className="flex items-center space-x-2 bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
          
          {filteredHistory.length > 0 && (
            <button
              onClick={exportHistory}
              className="flex items-center space-x-2 bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              <Download size={16} />
              <span>Export CSV</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center space-x-3">
            <History className="text-blue-400" size={24} />
            <div>
              <p className="text-gray-400 text-sm">Total Activities</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center space-x-3">
            <TrendingUp className="text-green-400" size={24} />
            <div>
              <p className="text-gray-400 text-sm">Delegations</p>
              <p className="text-2xl font-bold text-white">{stats.delegations}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center space-x-3">
            <TrendingDown className="text-red-400" size={24} />
            <div>
              <p className="text-gray-400 text-sm">Undelegations</p>
              <p className="text-2xl font-bold text-white">{stats.undelegations}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search by address or steward name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'delegate' | 'undelegate')}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Types</option>
              <option value="delegate">Delegations</option>
              <option value="undelegate">Undelegations</option>
            </select>
          </div>

          {/* Sort */}
          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
          >
            <Calendar size={16} />
            <span>{sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
          </button>
        </div>
      </div>

      {/* History List */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
        {filteredHistory.length > 0 ? (
          <div className="divide-y divide-white/10">
            {filteredHistory.map((record) => (
              <div key={record.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      record.type === 'delegate' ? 'bg-green-400' : 'bg-red-400'
                    }`}></div>
                    
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-medium">
                          {record.type === 'delegate' ? 'Delegated to' : 'Undelegated from'}
                        </span>
                        <span className="text-blue-400 font-medium">
                          {formatAddress(record.delegatee)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-gray-400 text-sm">
                          {formatDate(record.timestamp)}
                        </span>
                        
                        {record.transactionHash && (
                          <a
                            href={`https://basescan.org/tx/${record.transactionHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 text-purple-400 hover:text-purple-300 text-xs transition-colors"
                          >
                            <span className="font-mono">
                              {record.transactionHash.slice(0, 10)}...{record.transactionHash.slice(-8)}
                            </span>
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    record.type === 'delegate' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {record.type === 'delegate' ? 'Delegated' : 'Undelegated'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <History className="mx-auto text-gray-500 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-white mb-2">
              {delegationHistory.length === 0 ? 'No Delegation History' : 'No Results Found'}
            </h3>
            <p className="text-gray-400">
              {delegationHistory.length === 0 
                ? 'Your delegation activities will appear here once you start delegating.'
                : 'Try adjusting your search or filter criteria.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Information Panel */}
      <div className="bg-blue-500/10 rounded-lg border border-blue-500/20 p-4">
        <div className="flex items-start space-x-2">
          <div className="text-blue-400 mt-0.5">ℹ️</div>
          <div className="text-blue-200 text-sm">
            <p className="font-medium mb-1">About Delegation History</p>
            <p>
              This history shows all your delegation activities stored both locally and on-chain. 
              All transactions are verifiable on the Base network explorer.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HistoryPage
