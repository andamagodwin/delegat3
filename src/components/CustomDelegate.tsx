import { useState } from 'react';

interface CustomDelegateProps {
  onDelegate: (address: string) => Promise<{ success: boolean; error?: string }>;
  currentDelegate: string | null;
  isLoading: boolean;
}

const CustomDelegate = ({ onDelegate, currentDelegate, isLoading }: CustomDelegateProps) => {
  const [customAddress, setCustomAddress] = useState('');
  const [error, setError] = useState('');

  const isValidAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const handleDelegate = async () => {
    if (!customAddress) {
      setError('Please enter an address');
      return;
    }

    if (!isValidAddress(customAddress)) {
      setError('Please enter a valid Ethereum address');
      return;
    }

    setError('');
    const result = await onDelegate(customAddress);
    
    if (result.success) {
      setCustomAddress('');
    } else {
      setError(result.error || 'Failed to delegate');
    }
  };

  const handleAddressChange = (value: string) => {
    setCustomAddress(value);
    setError('');
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <h3 className="text-xl font-semibold text-white mb-4">Custom Delegate</h3>
      <p className="text-gray-300 mb-6">
        Delegate to any Ethereum address of your choice. Make sure you trust the address you're delegating to.
      </p>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="custom-address" className="block text-sm font-medium text-gray-300 mb-2">
            Ethereum Address
          </label>
          <input
            id="custom-address"
            type="text"
            value={customAddress}
            onChange={(e) => handleAddressChange(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          {error && (
            <p className="text-red-400 text-sm mt-2">{error}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="understand-risk"
              className="w-4 h-4 text-purple-600 bg-white/10 border-gray-300 rounded focus:ring-purple-500"
            />
            <label htmlFor="understand-risk" className="text-sm text-gray-300">
              I understand the risks of delegating to a custom address
            </label>
          </div>
        </div>

        <button
          onClick={handleDelegate}
          disabled={
            isLoading || 
            !customAddress || 
            !isValidAddress(customAddress) ||
            currentDelegate === customAddress
          }
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentDelegate === customAddress 
            ? 'Already Delegated to This Address' 
            : isLoading 
              ? 'Processing...' 
              : 'Delegate to Custom Address'
          }
        </button>
      </div>

      <div className="mt-6 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
        <div className="flex items-start space-x-2">
          <span className="text-yellow-400 mt-0.5">⚠️</span>
          <div className="text-yellow-200 text-sm">
            <p className="font-medium mb-1">Important Security Notice:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Only delegate to addresses you trust completely</li>
              <li>Verify the address is correct before confirming</li>
              <li>Your tokens remain in your wallet, but voting power transfers</li>
              <li>You can change or remove delegation at any time</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomDelegate;
