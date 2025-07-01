import type { Steward } from '../types';

interface StakeholdersListProps {
  stewards: Steward[];
  onDelegate: (address: string) => Promise<{ success: boolean; error?: string }>;
  currentDelegate: string | null;
  isLoading: boolean;
}

const StakeholdersList = ({ stewards, onDelegate, currentDelegate, isLoading }: StakeholdersListProps) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <h3 className="text-xl font-semibold text-white mb-6">Unlock Protocol Stewards</h3>
      <p className="text-gray-300 mb-6">
        Delegate to trusted community members who are actively involved in protocol governance.
      </p>
      
      <div className="grid gap-4">
        {stewards.map((steward) => (
          <div
            key={steward.address}
            className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="text-3xl">{steward.avatar}</div>
              <div>
                <h4 className="text-white font-semibold">{steward.name}</h4>
                <p className="text-gray-400 text-sm">{steward.description}</p>
                <p className="text-gray-500 text-xs font-mono mt-1">
                  {steward.address.slice(0, 10)}...{steward.address.slice(-8)}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => onDelegate(steward.address)}
              disabled={isLoading || currentDelegate === steward.address}
              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                currentDelegate === steward.address
                  ? 'bg-green-500/20 text-green-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              {currentDelegate === steward.address ? 'Current Delegate' : isLoading ? 'Processing...' : 'Delegate'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StakeholdersList;
