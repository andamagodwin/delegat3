import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/delegat3.svg" 
              alt="Delegat3 Logo" 
              className="w-32 rounded-lg"
            />
          </Link>
          <Link 
            to="/dashboard" 
            className="bg-primary-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-primary-600 transition-colors duration-200"
          >
            Launch App
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            About Delegat3
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed">
            Empowering Unlock Protocol governance through simplified delegation
          </p>
        </div>

        {/* What is Delegat3 */}
        <section className="mb-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-6">What is Delegat3?</h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Delegat3 is a user-friendly application that simplifies the process of delegating voting rights 
              for the Unlock Protocol token (UP) on the Base network. Whether you want to delegate to trusted 
              stewards, participate directly in governance, or delegate to a specific address, Delegat3 makes 
              it easy and transparent.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">🎯 Simple & Intuitive</h3>
                <p className="text-gray-300">
                  Clean interface designed for both newcomers and experienced DeFi users.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">🔒 Secure & Transparent</h3>
                <p className="text-gray-300">
                  Your tokens remain in your wallet. All transactions are on-chain and verifiable.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">How Delegation Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-2xl mb-4 mx-auto">
                1
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Connect Wallet</h3>
              <p className="text-gray-300">
                Connect your wallet containing UP tokens to the Base network.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-2xl mb-4 mx-auto">
                2
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Choose Delegate</h3>
              <p className="text-gray-300">
                Select a trusted steward, delegate to yourself, or enter a custom address.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-2xl mb-4 mx-auto">
                3
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Participate</h3>
              <p className="text-gray-300">
                Your voting power is now delegated and will be used in governance decisions.
              </p>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Key Features</h2>
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-start space-x-4">
                <div className="text-3xl">👥</div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Trusted Stewards</h3>
                  <p className="text-gray-300">
                    Delegate to vetted Unlock Protocol community members who are actively involved in governance 
                    and protocol development.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-start space-x-4">
                <div className="text-3xl">📊</div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Delegation History</h3>
                  <p className="text-gray-300">
                    Complete tracking of all your delegation activities with timestamps, transaction hashes, 
                    and detailed records stored both locally and on-chain.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-start space-x-4">
                <div className="text-3xl">🔄</div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Flexible Delegation</h3>
                  <p className="text-gray-300">
                    Change your delegation at any time. Delegate to yourself for direct control, or switch 
                    between different stewards as your preferences evolve.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-start space-x-4">
                <div className="text-3xl">🌐</div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Base Network</h3>
                  <p className="text-gray-300">
                    Built on Base for fast, low-cost transactions while maintaining full Ethereum compatibility 
                    and security.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-3">Is my UP token safe when delegating?</h3>
              <p className="text-gray-300">
                Yes, your UP tokens never leave your wallet. Delegation only transfers voting power, not ownership 
                of the tokens. You maintain full control and can undelegate at any time.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-3">Can I change my delegation?</h3>
              <p className="text-gray-300">
                Absolutely! You can change your delegation or undelegate completely at any time. Each change 
                requires a new transaction but gives you full flexibility in governance participation.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-3">What are the gas costs?</h3>
              <p className="text-gray-300">
                Since Delegat3 operates on Base network, gas costs are minimal compared to Ethereum mainnet. 
                Each delegation typically costs just a few cents.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-primary-500/20 to-primary-600/20 backdrop-blur-sm rounded-2xl p-8 border border-primary-300/30">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Participate in Governance?
            </h2>
            <p className="text-gray-300 mb-8 text-lg">
              Join the Unlock Protocol community and make your voice heard through delegation.
            </p>
            <Link 
              to="/dashboard" 
              className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-10 py-4 rounded-full text-lg font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-200 transform hover:scale-105 inline-block"
            >
              Start Delegating Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
