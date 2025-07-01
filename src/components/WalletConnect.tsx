interface WalletConnectProps {
  onConnect: () => Promise<{ success: boolean; error?: string }>;
}

const WalletConnect = ({ onConnect }: WalletConnectProps) => {
  const handleConnect = async () => {
    await onConnect();
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl"></div>
            <span className="text-white text-3xl font-bold">Delegat3</span>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">
            Connect Your Wallet
          </h1>
          <p className="text-gray-300 text-lg">
            Connect your wallet to start delegating your UP tokens and participate in Unlock Protocol governance.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg">
              <div className="text-2xl">🦊</div>
              <div>
                <h3 className="text-white font-semibold">MetaMask</h3>
                <p className="text-gray-400 text-sm">Connect using browser wallet</p>
              </div>
            </div>

            <button
              onClick={handleConnect}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105"
            >
              Connect Wallet
            </button>

            <div className="text-center text-gray-400 text-sm">
              <p>By connecting, you agree to our Terms of Service</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <h3 className="text-white font-semibold mb-4">Why Connect?</h3>
          <div className="grid grid-cols-1 gap-4 text-left">
            <div className="flex items-start space-x-3">
              <span className="text-green-400 mt-1">✓</span>
              <span className="text-gray-300 text-sm">Delegate your UP tokens safely</span>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-400 mt-1">✓</span>
              <span className="text-gray-300 text-sm">Track your delegation history</span>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-400 mt-1">✓</span>
              <span className="text-gray-300 text-sm">Participate in governance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletConnect;
