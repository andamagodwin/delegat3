import { getStewardByAddress } from '../data/stewards';

interface DelegationCardProps {
  currentDelegate: string | null;
  userAddress: string | null;
  onUndelegate: () => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
}

const DelegationCard = ({ currentDelegate, userAddress, onUndelegate, isLoading }: DelegationCardProps) => {
  if (!currentDelegate || currentDelegate === '0x0000000000000000000000000000000000000000') {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-8">
        <div className="text-center">
          <div className="text-4xl mb-4">🗳️</div>
          <h3 className="text-xl font-semibold text-white mb-2">No Active Delegation</h3>
          <p className="text-gray-300">
            Your voting rights are not currently delegated. Choose a delegate below to participate in governance.
          </p>
        </div>
      </div>
    );
  }

  const steward = getStewardByAddress(currentDelegate);
  const isSelfDelegated = currentDelegate === userAddress;

  return (
    <div className="bg-gradient-to-r from-primary-500/20 to-primary-600/20 backdrop-blur-sm rounded-xl p-6 border border-primary-300/30 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-4xl">
            {isSelfDelegated ? '👤' : steward?.avatar || '🗳️'}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-1">
              Currently Delegated To
            </h3>
            <p className="text-lg text-purple-200">
              {isSelfDelegated 
                ? 'Yourself' 
                : steward?.name || `${currentDelegate.slice(0, 8)}...${currentDelegate.slice(-6)}`
              }
            </p>
            {steward && !isSelfDelegated && (
              <p className="text-gray-300 text-sm mt-1">{steward.description}</p>
            )}
          </div>
        </div>
        
        <button
          onClick={onUndelegate}
          disabled={isLoading}
          className="bg-red-500/20 text-red-400 px-6 py-3 rounded-lg font-semibold hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Processing...' : 'Undelegate'}
        </button>
      </div>
      
      <div className="mt-4 p-4 bg-white/10 rounded-lg">
        <div className="flex items-center space-x-2">
          <span className="text-green-400">✓</span>
          <span className="text-gray-300 text-sm">
            Your voting rights are actively delegated. All UP tokens in your wallet contribute to voting power.
          </span>
        </div>
      </div>
    </div>
  );
};

export default DelegationCard;
