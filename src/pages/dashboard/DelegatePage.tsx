import { useState, useEffect } from 'react'
import { useWallet } from '../../hooks/useWalletContext'
import { useDelegation } from '../../hooks/useDelegation'
import { UNLOCK_STEWARDS } from '../../data/stewards'
import { User, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react'

const DelegatePage = () => {
  const { walletState, provider } = useWallet()
  const { delegationState, delegateVotes, undelegateVotes, getVotingPower, getTokenBalance } = useDelegation(
    provider,
    walletState.address
  )

  const [customAddress, setCustomAddress] = useState('')
  const [tokenBalance, setTokenBalance] = useState('0')
  const [votingPower, setVotingPower] = useState('0')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const loadBalance = async () => {
      if (walletState.address && provider) {
        const [balance, power] = await Promise.all([
          getTokenBalance(),
          getVotingPower()
        ])
        setTokenBalance(balance)
        setVotingPower(power)
      }
    }
    loadBalance()
  }, [walletState.address, provider, getTokenBalance, getVotingPower])

  const handleDelegate = async (delegatee: string, name?: string) => {
    setError('')
    setSuccess('')
    
    const result = await delegateVotes(delegatee)
    if (result.success) {
      setSuccess(`Successfully delegated to ${name || delegatee.slice(0, 8) + '...'}`)
      // Refresh voting power
      getVotingPower().then(setVotingPower)
    } else {
      setError(result.error || 'Failed to delegate')
    }
  }

  const handleUndelegate = async () => {
    setError('')
    setSuccess('')
    
    const result = await undelegateVotes()
    if (result.success) {
      setSuccess('Successfully undelegated voting rights')
      // Refresh voting power
      getVotingPower().then(setVotingPower)
    } else {
      setError(result.error || 'Failed to undelegate')
    }
  }

  const isValidAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Delegate Voting Rights</h1>
        <p className="text-gray-400">Choose how to delegate your UP token voting power</p>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 flex items-center space-x-2">
          <AlertCircle className="text-red-400" size={20} />
          <span className="text-red-200">{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 flex items-center space-x-2">
          <CheckCircle className="text-green-400" size={20} />
          <span className="text-green-200">{success}</span>
        </div>
      )}

      {/* Current Status */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-gray-400 text-sm font-medium mb-2">UP Token Balance</h3>
          <p className="text-2xl font-bold text-white">{parseFloat(tokenBalance).toFixed(2)} UP</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-gray-400 text-sm font-medium mb-2">Voting Power</h3>
          <p className="text-2xl font-bold text-white">{parseFloat(votingPower).toFixed(2)} UP</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-gray-400 text-sm font-medium mb-2">Current Delegate</h3>
          <p className="text-lg text-white truncate">
            {delegationState.currentDelegate 
              ? delegationState.currentDelegate === walletState.address 
                ? 'Self' 
                : `${delegationState.currentDelegate.slice(0, 8)}...`
              : 'None'
            }
          </p>
        </div>
      </div>

      {/* Current Delegation */}
      {delegationState.currentDelegate && (
        <div className="bg-gradient-to-r from-primary-500/20 to-primary-600/20 backdrop-blur-sm rounded-xl p-6 border border-primary-300/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Currently Delegated</h3>
              <p className="text-purple-200">
                Your voting rights are delegated to:{' '}
                <span className="text-white font-semibold">
                  {delegationState.currentDelegate === walletState.address 
                    ? 'Yourself' 
                    : `${delegationState.currentDelegate.slice(0, 10)}...${delegationState.currentDelegate.slice(-8)}`
                  }
                </span>
              </p>
            </div>
            <button
              onClick={handleUndelegate}
              disabled={delegationState.isLoading}
              className="bg-red-500/20 text-red-400 px-6 py-3 rounded-lg font-semibold hover:bg-red-500/30 transition-colors disabled:opacity-50"
            >
              {delegationState.isLoading ? 'Processing...' : 'Undelegate'}
            </button>
          </div>
        </div>
      )}

      {/* Self Delegation */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <User className="text-blue-400" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Delegate to Yourself</h3>
              <p className="text-gray-300">Keep full control of your voting rights</p>
            </div>
          </div>
          <button
            onClick={() => handleDelegate(walletState.address!, 'yourself')}
            disabled={delegationState.isLoading || delegationState.currentDelegate === walletState.address}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {delegationState.currentDelegate === walletState.address ? 'Currently Self-Delegated' : 'Delegate to Self'}
          </button>
        </div>
      </div>

      {/* Stewards */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-6">Unlock Protocol Stewards</h3>
        <div className="grid gap-4">
          {UNLOCK_STEWARDS.map((steward) => (
            <div
              key={steward.address}
              className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
            >
              <div className="flex items-center space-x-4">
                <div className="text-3xl">{steward.avatar}</div>
                <div>
                  <h4 className="text-white font-semibold">{steward.name}</h4>
                  <p className="text-gray-400 text-sm">{steward.description}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="text-gray-500 text-xs font-mono">
                      {steward.address.slice(0, 10)}...{steward.address.slice(-8)}
                    </p>
                    <a
                      href={`https://basescan.org/address/${steward.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-300"
                    >
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => handleDelegate(steward.address, steward.name)}
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
          ))}
        </div>
      </div>

      {/* Custom Delegate */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-4">Custom Delegate</h3>
        <p className="text-gray-300 mb-6">
          Delegate to any Ethereum address of your choice
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Ethereum Address
            </label>
            <input
              type="text"
              value={customAddress}
              onChange={(e) => setCustomAddress(e.target.value)}
              placeholder="0x..."
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            onClick={() => handleDelegate(customAddress)}
            disabled={
              delegationState.isLoading || 
              !customAddress || 
              !isValidAddress(customAddress) ||
              delegationState.currentDelegate === customAddress
            }
            className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 rounded-lg font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {delegationState.currentDelegate === customAddress 
              ? 'Already Delegated to This Address' 
              : delegationState.isLoading 
                ? 'Processing...' 
                : 'Delegate to Custom Address'
            }
          </button>
        </div>

        <div className="mt-6 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
          <div className="flex items-start space-x-2">
            <AlertCircle className="text-yellow-400 mt-0.5" size={16} />
            <div className="text-yellow-200 text-sm">
              <p className="font-medium mb-1">Security Notice:</p>
              <p>Only delegate to addresses you trust. Your tokens remain in your wallet, but voting power transfers.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DelegatePage
