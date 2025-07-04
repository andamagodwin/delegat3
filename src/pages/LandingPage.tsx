import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Play, X, Github } from 'lucide-react';
import LazyImage from '../components/LazyImage';

const LandingPage = () => {
  const [showVideoModal, setShowVideoModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <LazyImage 
              src="/delegat3.svg" 
              alt="Delegat3 Logo" 
              className="w-32 rounded-lg"
              showSpinner={true}
            />
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/andamagodwin/delegat3"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200 font-medium"
              title="View on GitHub"
            >
              <Github size={20} />
              <span className="hidden sm:inline">GitHub</span>
            </a>
            <button
              onClick={() => setShowVideoModal(true)}
              className="flex items-center space-x-2 text-primary-400 hover:text-primary-300 transition-colors duration-200 font-medium"
            >
              <Play size={20} />
              <span>Watch Demo</span>
            </button>
            <Link 
              to="/dashboard" 
              className="bg-primary-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-primary-600 transition-colors duration-200"
            >
              Launch App
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 px-6 pt-20 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between p-16 gap-12 lg:gap-16">
            {/* Left Column - Text Content */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-8">
                Web3 governance,
                <span className="block bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                  delegated your way.
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-12 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Take control of your Unlock Protocol governance. Delegate your UP tokens to trusted stewards, 
                participate in protocol decisions, or delegate to yourself and vote directly.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link 
                  to="/dashboard" 
                  className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-200 transform hover:scale-105"
                  
                >
                  Get Started
                </Link>
                <Link
                  to="/about"
                  className="border-2 border-primary-500 text-primary-500 px-8 py-4 rounded-full text-lg font-semibold hover:bg-primary-500 hover:text-white transition-all duration-200"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Right Column - Voting Illustration */}
            <div className="flex-shrink-0 flex justify-center items-center">
              <div className="relative">
                <LazyImage 
                  src="/voting.svg" 
                  alt="Voting Illustration" 
                  className="w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl h-auto"
                  showSpinner={true}
                />
                {/* Subtle glow effect behind the image */}
                <div className="absolute inset-0 bg-primary-500/10 blur-3xl rounded-full transform scale-75 -z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Video Section */}
      <div className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            See Delegat3 in Action
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Watch how easy it is to delegate your UP tokens, manage your voting power, 
            and participate in Unlock Protocol governance.
          </p>
          
          {/* Video Preview Card */}
          <div className="relative group cursor-pointer" onClick={() => setShowVideoModal(true)}>
            <div className="relative bg-gradient-to-br from-primary-500/20 to-primary-600/20 backdrop-blur-sm rounded-2xl p-8 border border-primary-300/30 hover:border-primary-300/50 transition-all duration-300">
              {/* Video Thumbnail */}
              <div className="relative aspect-video bg-slate-800/50 rounded-xl mb-6 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-primary-600/10 rounded-xl"></div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Play size={32} className="text-white ml-1" />
                  </div>
                  <p className="text-white font-semibold mt-4 text-lg">Watch Demo Video</p>
                  <p className="text-gray-400 text-sm">3 minutes overview</p>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute top-4 left-4 w-3 h-3 bg-red-500 rounded-full opacity-60"></div>
                <div className="absolute top-4 left-10 w-3 h-3 bg-yellow-500 rounded-full opacity-60"></div>
                <div className="absolute top-4 left-16 w-3 h-3 bg-green-500 rounded-full opacity-60"></div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-primary-400 font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Connect Wallet</h4>
                    <p className="text-gray-400 text-sm">Simple MetaMask connection</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-primary-400 font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Choose Delegate</h4>
                    <p className="text-gray-400 text-sm">Pick from trusted stewards</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-primary-400 font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Start Participating</h4>
                    <p className="text-gray-400 text-sm">Your voice in governance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 px-16 py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-16">
            Why Delegate with Us?
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/dashboard" 
              className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-10 py-4 rounded-full text-lg font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-200 transform hover:scale-105 inline-block"
            >
              Launch Delegat3 App
            </Link>
            <a
              href="https://github.com/andamagodwin/delegat3"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 border-2 border-gray-500 text-gray-300 hover:text-white hover:border-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-200"
            >
              <Github size={20} />
              <span>View on GitHub</span>
            </a>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideoModal && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setShowVideoModal(false)}
        >
          <div 
            className="relative max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
            >
              <X size={32} />
            </button>
            
            {/* Video Container */}
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
              <iframe
                src="https://www.youtube.com/embed/6snWoY4GLkE"
            
                title="Delegat3 Demo Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-600 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-400 rounded-full mix-blend-multiply filter blur-xl opacity-10"></div>
      </div>
    </div>
  );
};

export default LandingPage;
