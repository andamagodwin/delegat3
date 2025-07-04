import { useState, useEffect } from 'react'
import { useWallet } from '../../hooks/useWalletContext'
import { useDelegation } from '../../hooks/useDelegation'
import { 
  TrendingUp, 
  Users, 
  Activity, 
  Zap,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

const DashboardOverview = () => {
  const { walletState, provider } = useWallet()
  // Removed debug logging to prevent console spam
  
  const { delegationState, delegationHistory, getVotingPower, getTokenBalance } = useDelegation(
    provider,
    walletState.address
  )

  const [stats, setStats] = useState({
    tokenBalance: '0',
    votingPower: '0',
    totalDelegations: 0,
    activeDelegations: 0
  })
  const [isLoadingStats, setIsLoadingStats] = useState(false)

  useEffect(() => {
    let isCancelled = false;
    
    const loadStats = async () => {
      if (walletState.address && provider && !isLoadingStats && !isCancelled) {
        setIsLoadingStats(true)
        try {
          const [tokenBalance, votingPower] = await Promise.all([
            getTokenBalance().catch(() => '0'),
            getVotingPower().catch(() => '0')
          ])

          if (!isCancelled) {
            setStats({
              tokenBalance,
              votingPower,
              totalDelegations: delegationHistory.length,
              activeDelegations: delegationState.currentDelegate ? 1 : 0
            })
          }
        } catch (error) {
          console.error('Error loading stats:', error);
          if (!isCancelled) {
            setStats({
              tokenBalance: '0',
              votingPower: '0',
              totalDelegations: delegationHistory.length,
              activeDelegations: delegationState.currentDelegate ? 1 : 0
            })
          }
        } finally {
          if (!isCancelled) {
            setIsLoadingStats(false)
          }
        }
      }
    }

    loadStats()
    
    return () => {
      isCancelled = true;
    };
  }, [walletState.address, provider, delegationHistory.length, delegationState.currentDelegate, getTokenBalance, getVotingPower, isLoadingStats])

  const recentDelegations = delegationHistory.slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome back to your delegation overview</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Connected Wallet</p>
          <p className="text-white font-mono">
            {walletState.address?.slice(0, 8)}...{walletState.address?.slice(-6)}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">UP Token Balance</p>
              <p className="text-2xl font-bold text-white mt-1">
                {parseFloat(stats.tokenBalance).toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Zap className="text-blue-400" size={24} />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <ArrowUpRight className="text-green-400 mr-1" size={16} />
            <span className="text-green-400">Available for delegation</span>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Voting Power</p>
              <p className="text-2xl font-bold text-white mt-1">
                {parseFloat(stats.votingPower).toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-purple-400" size={24} />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            {delegationState.currentDelegate ? (
              <>
                <ArrowUpRight className="text-green-400 mr-1" size={16} />
                <span className="text-green-400">Currently delegated</span>
              </>
            ) : (
              <>
                <ArrowDownRight className="text-gray-400 mr-1" size={16} />
                <span className="text-gray-400">Not delegated</span>
              </>
            )}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Delegations</p>
              <p className="text-2xl font-bold text-white mt-1">{stats.totalDelegations}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Activity className="text-green-400" size={24} />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-gray-400">Lifetime activities</span>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Active Delegations</p>
              <p className="text-2xl font-bold text-white mt-1">{stats.activeDelegations}</p>
            </div>
            <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center">
              <Users className="text-pink-400" size={24} />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-gray-400">Currently active</span>
          </div>
        </div>
      </div>

      {/* Current Delegation Status */}
      {delegationState.currentDelegate && (
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl p-6 border border-purple-300/30">
          <h3 className="text-xl font-semibold text-white mb-4">Current Delegation Status</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 mb-1">Delegated to:</p>
              <p className="text-white font-semibold">
                {delegationState.currentDelegate === walletState.address 
                  ? 'Yourself (Self-delegated)' 
                  : `${delegationState.currentDelegate.slice(0, 10)}...${delegationState.currentDelegate.slice(-8)}`
                }
              </p>
            </div>
            <a
              href={`https://basescan.org/address/${delegationState.currentDelegate}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
            >
              <span>View on Explorer</span>
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4">Recent Delegations</h3>
          {recentDelegations.length > 0 ? (
            <div className="space-y-3">
              {recentDelegations.map((delegation) => (
                <div key={delegation.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      delegation.type === 'delegate' ? 'bg-green-400' : 'bg-red-400'
                    }`}></div>
                    <div>
                      <p className="text-white text-sm font-medium">
                        {delegation.type === 'delegate' ? 'Delegated to' : 'Undelegated from'}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {new Date(delegation.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-300 text-xs">
                      {delegation.delegatee.slice(0, 8)}...
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="mx-auto text-gray-500 mb-2" size={32} />
              <p className="text-gray-400">No delegations yet</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <a
              href="/dashboard/delegate"
              className="block p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-300/30 hover:border-purple-300/50 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Delegate Voting Rights</h4>
                  <p className="text-gray-300 text-sm">Choose your delegate</p>
                </div>
                <ArrowUpRight className="text-purple-400" size={20} />
              </div>
            </a>

            <a
              href="/dashboard/stewards"
              className="block p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">View Stewards</h4>
                  <p className="text-gray-300 text-sm">Browse trusted delegates</p>
                </div>
                <ArrowUpRight className="text-gray-400" size={20} />
              </div>
            </a>

            <a
              href="/dashboard/history"
              className="block p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">View History</h4>
                  <p className="text-gray-300 text-sm">Track your delegations</p>
                </div>
                <ArrowUpRight className="text-gray-400" size={20} />
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardOverview
