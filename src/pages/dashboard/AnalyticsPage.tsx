import { useState, useEffect } from 'react'
import { useWallet } from '../../hooks/useWalletContext'
import { useDelegation } from '../../hooks/useDelegation'
import { UNLOCK_STEWARDS } from '../../data/stewards'
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Target,
  PieChart,
  Activity
} from 'lucide-react'

const AnalyticsPage = () => {
  const { walletState, provider } = useWallet()
  const { delegationHistory } = useDelegation(
    provider,
    walletState.address
  )

  const [analytics, setAnalytics] = useState({
    totalDelegations: 0,
    uniqueDelegates: 0,
    avgDelegationDuration: 0,
    mostUsedDelegate: '',
    delegationByMonth: [] as { month: string; count: number }[],
    delegateDistribution: [] as { name: string; count: number; percentage: number }[]
  })

  useEffect(() => {
    if (delegationHistory.length === 0) return

    // Calculate analytics
    const delegations = delegationHistory.filter(h => h.type === 'delegate')
    const uniqueDelegates = new Set(delegations.map(d => d.delegatee)).size
    
    // Delegate usage count
    const delegateCount = delegations.reduce((acc, d) => {
      acc[d.delegatee] = (acc[d.delegatee] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const mostUsed = Object.entries(delegateCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || ''

    // Monthly distribution
    const monthlyData = delegations.reduce((acc, d) => {
      const month = new Date(d.timestamp).toLocaleString('default', { month: 'short', year: 'numeric' })
      acc[month] = (acc[month] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const delegationByMonth = Object.entries(monthlyData)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())

    // Delegate distribution
    const delegateDistribution = Object.entries(delegateCount)
      .map(([address, count]) => {
        const steward = UNLOCK_STEWARDS.find(s => s.address === address)
        return {
          name: steward?.name || (address === walletState.address ? 'Self' : `${address.slice(0, 8)}...`),
          count,
          percentage: (count / delegations.length) * 100
        }
      })
      .sort((a, b) => b.count - a.count)

    setAnalytics({
      totalDelegations: delegations.length,
      uniqueDelegates,
      avgDelegationDuration: 0, // Would need more complex calculation
      mostUsedDelegate: mostUsed,
      delegationByMonth,
      delegateDistribution
    })
  }, [delegationHistory, walletState.address])

  const formatAddress = (address: string) => {
    if (address === walletState.address) return 'Self'
    const steward = UNLOCK_STEWARDS.find(s => s.address === address)
    return steward?.name || `${address.slice(0, 8)}...`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
        <p className="text-gray-400">Insights into your delegation patterns and voting behavior</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Delegations</p>
              <p className="text-2xl font-bold text-white mt-1">{analytics.totalDelegations}</p>
            </div>
            <BarChart3 className="text-blue-400" size={24} />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Unique Delegates</p>
              <p className="text-2xl font-bold text-white mt-1">{analytics.uniqueDelegates}</p>
            </div>
            <Target className="text-purple-400" size={24} />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">This Month</p>
              <p className="text-2xl font-bold text-white mt-1">
                {analytics.delegationByMonth[analytics.delegationByMonth.length - 1]?.count || 0}
              </p>
            </div>
            <TrendingUp className="text-green-400" size={24} />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Activity Score</p>
              <p className="text-2xl font-bold text-white mt-1">
                {analytics.totalDelegations > 10 ? 'High' : analytics.totalDelegations > 3 ? 'Medium' : 'Low'}
              </p>
            </div>
            <Activity className="text-orange-400" size={24} />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Activity */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center space-x-2 mb-6">
            <Clock className="text-blue-400" size={20} />
            <h3 className="text-xl font-semibold text-white">Monthly Activity</h3>
          </div>
          
          {analytics.delegationByMonth.length > 0 ? (
            <div className="space-y-4">
              {analytics.delegationByMonth.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">{item.month}</span>
                  <div className="flex items-center space-x-2 flex-1 ml-4">
                    <div className="flex-1 bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                        style={{ 
                          width: `${(item.count / Math.max(...analytics.delegationByMonth.map(d => d.count))) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-white text-sm font-medium w-8 text-right">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="mx-auto text-gray-500 mb-2" size={32} />
              <p className="text-gray-400">No activity data yet</p>
            </div>
          )}
        </div>

        {/* Delegate Distribution */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center space-x-2 mb-6">
            <PieChart className="text-purple-400" size={20} />
            <h3 className="text-xl font-semibold text-white">Delegate Distribution</h3>
          </div>
          
          {analytics.delegateDistribution.length > 0 ? (
            <div className="space-y-4">
              {analytics.delegateDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm truncate flex-1">{item.name}</span>
                  <div className="flex items-center space-x-2 ml-4">
                    <div className="w-16 bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-white text-sm font-medium w-12 text-right">
                      {item.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <PieChart className="mx-auto text-gray-500 mb-2" size={32} />
              <p className="text-gray-400">No delegation data yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Most Used Delegate */}
      {analytics.mostUsedDelegate && (
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl p-6 border border-purple-300/30">
          <h3 className="text-xl font-semibold text-white mb-4">Most Trusted Delegate</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 mb-1">You delegate most frequently to:</p>
              <p className="text-white text-lg font-semibold">
                {formatAddress(analytics.mostUsedDelegate)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-purple-200 text-sm">Usage Count</p>
              <p className="text-white text-2xl font-bold">
                {analytics.delegateDistribution[0]?.count || 0}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Insights */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-4">Insights</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-white font-medium mb-2">Delegation Behavior</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• You have made {analytics.totalDelegations} total delegations</li>
              <li>• You have used {analytics.uniqueDelegates} different delegates</li>
              <li>• Your delegation activity is {analytics.totalDelegations > 5 ? 'high' : 'moderate'}</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-2">Recommendations</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Consider diversifying between different stewards</li>
              <li>• Review steward performance regularly</li>
              <li>• Stay active in governance participation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsPage
