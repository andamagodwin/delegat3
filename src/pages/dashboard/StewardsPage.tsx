import { useState } from 'react'
import { UNLOCK_STEWARDS } from '../../data/stewards'
import { useWallet } from '../../hooks/useWalletContext'
import { useDelegation } from '../../hooks/useDelegation'
import { ExternalLink, Users, Award, TrendingUp, CheckCircle } from 'lucide-react'
import type { Steward } from '../../types'

const StewardsPage = () => {
  const { walletState, provider } = useWallet()
  const { delegationState, delegateVotes } = useDelegation(provider, walletState.address)
  const [selectedSteward, setSelectedSteward] = useState<Steward | null>(null)

  const handleDelegate = async (steward: Steward) => {
    const result = await delegateVotes(steward.address)
    if (result.success) {
      // Handle success - could show toast notification
      console.log('Delegation successful')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Unlock Protocol Stewards</h1>
        <p className="text-gray-400">Trusted community members actively involved in protocol governance</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center space-x-3">
            <Users className="text-blue-400" size={24} />
            <div>
              <p className="text-gray-400 text-sm">Total Stewards</p>
              <p className="text-2xl font-bold text-white">{UNLOCK_STEWARDS.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center space-x-3">
            <Award className="text-purple-400" size={24} />
            <div>
              <p className="text-gray-400 text-sm">Active Since</p>
              <p className="text-2xl font-bold text-white">2021</p>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center space-x-3">
            <TrendingUp className="text-green-400" size={24} />
            <div>
              <p className="text-gray-400 text-sm">Governance Participation</p>
              <p className="text-2xl font-bold text-white">High</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stewards Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {UNLOCK_STEWARDS.map((steward) => (
          <div
            key={steward.address}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-white/30 transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{steward.avatar}</div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{steward.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-gray-400 text-sm font-mono">
                      {steward.address.slice(0, 10)}...{steward.address.slice(-8)}
                    </span>
                    <a
                      href={`https://basescan.org/address/${steward.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </div>
              
              {delegationState.currentDelegate === steward.address && (
                <div className="flex items-center space-x-1 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                  <CheckCircle size={14} />
                  <span>Current</span>
                </div>
              )}
            </div>

            <p className="text-gray-300 mb-4 leading-relaxed">{steward.description}</p>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelectedSteward(steward)}
                className="text-purple-400 hover:text-purple-300 font-medium text-sm transition-colors"
              >
                Learn More
              </button>
              
              <button
                onClick={() => handleDelegate(steward)}
                disabled={delegationState.isLoading || delegationState.currentDelegate === steward.address}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  delegationState.currentDelegate === steward.address
                    ? 'bg-green-500/20 text-green-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 disabled:opacity-50'
                }`}
              >
                {delegationState.currentDelegate === steward.address 
                  ? 'Current Delegate' 
                  : delegationState.isLoading 
                    ? 'Processing...' 
                    : 'Delegate'
                }
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Steward Details Modal */}
      {selectedSteward && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="text-5xl">{selectedSteward.avatar}</div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedSteward.name}</h2>
                  <p className="text-gray-400 font-mono text-sm">
                    {selectedSteward.address}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSteward(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">About</h3>
                <p className="text-gray-300 leading-relaxed">{selectedSteward.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Governance Participation</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Proposals Voted</p>
                    <p className="text-xl font-bold text-white">15+</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Community Score</p>
                    <p className="text-xl font-bold text-white">High</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Links</h3>
                <div className="flex space-x-4">
                  <a
                    href={`https://basescan.org/address/${selectedSteward.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <ExternalLink size={16} />
                    <span>View on BaseScan</span>
                  </a>
                </div>
              </div>

              <div className="flex space-x-4 pt-4 border-t border-white/10">
                <button
                  onClick={() => setSelectedSteward(null)}
                  className="flex-1 bg-white/10 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleDelegate(selectedSteward)
                    setSelectedSteward(null)
                  }}
                  disabled={delegationState.isLoading || delegationState.currentDelegate === selectedSteward.address}
                  className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-primary-600 hover:to-primary-700 transition-all disabled:opacity-50"
                >
                  {delegationState.currentDelegate === selectedSteward.address 
                    ? 'Current Delegate' 
                    : 'Delegate Now'
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StewardsPage
