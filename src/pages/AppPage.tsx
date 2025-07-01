import { useState, useEffect } from 'react';
import { useWallet } from '../hooks/useWallet';
import { useDelegation } from '../hooks/useDelegation';
import { UNLOCK_STEWARDS } from '../data/stewards';
import WalletConnect from '../components/WalletConnect';
import DelegationCard from '../components/DelegationCard';
import StakeholdersList from '../components/StakeholdersList';
import DelegationHistory from '../components/DelegationHistory';
import CustomDelegate from '../components/CustomDelegate';

const AppPage = () => {
  const { walletState, provider, connectWallet, disconnectWallet, switchToBase, isOnBase } = useWallet();
  const { delegationState, delegationHistory, delegateVotes, undelegateVotes, getVotingPower, getTokenBalance } = useDelegation(
    provider,
    walletState.address
  );

  const [activeTab, setActiveTab] = useState<'delegate' | 'history'>('delegate');
  const [votingPower, setVotingPower] = useState('0');
  const [tokenBalance, setTokenBalance] = useState('0');

  useEffect(() => {
    if (walletState.address && provider) {
      getVotingPower().then(setVotingPower);
      getTokenBalance().then(setTokenBalance);
    }
  }, [walletState.address, provider, getVotingPower, getTokenBalance]);

  const handleDelegate = async (delegatee: string) => {
    const result = await delegateVotes(delegatee);
    if (result.success) {
      // Refresh voting power after successful delegation
      getVotingPower().then(setVotingPower);
    }
    return result;
  };

  const handleUndelegate = async () => {
    const result = await undelegateVotes();
    if (result.success) {
      // Refresh voting power after successful undelegation
      getVotingPower().then(setVotingPower);
    }
    return result;
  };

  if (!walletState.isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <WalletConnect onConnect={connectWallet} />
      </div>
    );
  }

  if (!isOnBase) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">Wrong Network</h2>
          <p className="text-gray-300 mb-6">
            Please switch to Base network to use the delegation features.
          </p>
          <button
            onClick={switchToBase}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
          >
            Switch to Base
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="px-6 py-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg"></div>
            <span className="text-white text-xl font-bold">Delegat3</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-white text-sm">
                {walletState.address?.slice(0, 6)}...{walletState.address?.slice(-4)}
              </div>
              <div className="text-gray-400 text-xs">Base Network</div>
            </div>
            <button
              onClick={disconnectWallet}
              className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              Disconnect
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
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

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-white/10 backdrop-blur-sm rounded-lg p-1 border border-white/20 w-fit">
          <button
            onClick={() => setActiveTab('delegate')}
            className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
              activeTab === 'delegate'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Delegate Votes
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            History ({delegationHistory.length})
          </button>
        </div>

        {/* Current Delegation Status */}
        <DelegationCard
          currentDelegate={delegationState.currentDelegate}
          userAddress={walletState.address}
          onUndelegate={handleUndelegate}
          isLoading={delegationState.isLoading}
        />

        {/* Tab Content */}
        {activeTab === 'delegate' ? (
          <div className="space-y-8">
            {/* Self Delegation */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">Delegate to Yourself</h3>
              <p className="text-gray-300 mb-4">
                Keep full control of your voting rights by delegating to yourself.
              </p>
              <button
                onClick={() => handleDelegate(walletState.address!)}
                disabled={delegationState.isLoading || delegationState.currentDelegate === walletState.address}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {delegationState.currentDelegate === walletState.address ? 'Currently Self-Delegated' : 'Delegate to Self'}
              </button>
            </div>

            {/* Stewards List */}
            <StakeholdersList
              stewards={UNLOCK_STEWARDS}
              onDelegate={handleDelegate}
              currentDelegate={delegationState.currentDelegate}
              isLoading={delegationState.isLoading}
            />

            {/* Custom Delegate */}
            <CustomDelegate
              onDelegate={handleDelegate}
              currentDelegate={delegationState.currentDelegate}
              isLoading={delegationState.isLoading}
            />
          </div>
        ) : (
          <DelegationHistory history={delegationHistory} />
        )}
      </div>
    </div>
  );
};

export default AppPage;
