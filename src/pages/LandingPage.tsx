import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg"></div>
            <span className="text-white text-xl font-bold">Delegat3</span>
          </div>
          <Link 
            to="/app" 
            className="bg-white text-purple-900 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-200"
          >
            Launch App
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 px-6 pt-20 pb-32">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8">
            Delegate Your
            <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Voting Power
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Take control of your Unlock Protocol governance. Delegate your UP tokens to trusted stewards, 
            participate in protocol decisions, or delegate to yourself and vote directly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/app" 
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105"
            >
              Get Started
            </Link>
            <Link 
              to="/about" 
              className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-purple-900 transition-all duration-200"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-16">
            Why Delegate with Delegat3?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-white mb-4">Easy Delegation</h3>
              <p className="text-gray-300">
                Simple interface to delegate your UP tokens to trusted stewards or yourself with just a few clicks.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-white mb-4">Track History</h3>
              <p className="text-gray-300">
                Keep a complete record of all your delegation activities and voting power changes over time.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold text-white mb-4">Secure & Transparent</h3>
              <p className="text-gray-300">
                Built on Base network with full transparency. Your tokens remain in your wallet at all times.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stewards Preview */}
      <div className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Trusted Unlock Protocol Stewards
          </h2>
          <p className="text-gray-300 mb-12 max-w-2xl mx-auto">
            Delegate to experienced community members who are actively involved in protocol governance and development.
          </p>
          
          <div className="grid md:grid-cols-5 gap-6">
            {[
              { name: 'Julien G.', role: 'Co-founder', avatar: '👨‍💻' },
              { name: 'Christopher C.', role: 'Community Lead', avatar: '🤝' },
              { name: 'Clément L.', role: 'Technical Advisor', avatar: '🔒' },
              { name: 'Angela S.', role: 'Growth Lead', avatar: '📈' },
              { name: 'Kalidou D.', role: 'Core Developer', avatar: '⚡' },
            ].map((steward, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-3xl mb-3">{steward.avatar}</div>
                <h4 className="text-white font-semibold">{steward.name}</h4>
                <p className="text-gray-400 text-sm">{steward.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Participate in Governance?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Connect your wallet and start delegating your UP tokens today.
          </p>
          <Link 
            to="/app" 
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-10 py-4 rounded-full text-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 inline-block"
          >
            Launch Delegat3 App
          </Link>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10"></div>
      </div>
    </div>
  );
};

export default LandingPage;
