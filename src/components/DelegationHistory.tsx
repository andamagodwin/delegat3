import type { DelegationRecord } from '../types';
import { getStewardByAddress } from '../data/stewards';

interface DelegationHistoryProps {
  history: DelegationRecord[];
}

const DelegationHistory = ({ history }: DelegationHistoryProps) => {
  if (history.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 text-center">
        <div className="text-4xl mb-4">📋</div>
        <h3 className="text-xl font-semibold text-white mb-2">No Delegation History</h3>
        <p className="text-gray-300">
          Your delegation activities will appear here once you start delegating your voting rights.
        </p>
      </div>
    );
  }

  const formatAddress = (address: string) => {
    if (address === '0x0000000000000000000000000000000000000000') {
      return 'Undelegated';
    }
    const steward = getStewardByAddress(address);
    return steward?.name || `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <h3 className="text-xl font-semibold text-white mb-6">Delegation History</h3>
      <p className="text-gray-300 mb-6">
        Complete record of your delegation activities. Total delegations: {history.length}
      </p>
      
      <div className="space-y-4">
        {history.map((record) => (
          <div
            key={record.id}
            className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
          >
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
                
                <div className="text-gray-400 text-sm mt-1">
                  {formatDate(record.timestamp)}
                </div>
                
                {record.transactionHash && (
                  <a
                    href={`https://basescan.org/tx/${record.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 text-xs font-mono mt-1 inline-block"
                  >
                    {record.transactionHash.slice(0, 10)}...{record.transactionHash.slice(-8)} ↗
                  </a>
                )}
              </div>
            </div>
            
            <div className="text-right">
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
      
      <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
        <div className="flex items-center space-x-2">
          <span className="text-blue-400">ℹ️</span>
          <span className="text-blue-200 text-sm">
            All delegation data is stored locally and on-chain. Your privacy is maintained while ensuring transparency.
          </span>
        </div>
      </div>
    </div>
  );
};

export default DelegationHistory;
