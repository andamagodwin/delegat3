import LoadingSpinner from './LoadingSpinner';

interface PageLoaderProps {
  message?: string;
  showLogo?: boolean;
}

const PageLoader = ({ message = 'Loading...', showLogo = true }: PageLoaderProps) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Logo */}
        {showLogo && (
          <div className="mb-8 flex justify-center">
            <img 
              src="/delegat3.svg" 
              alt="Delegat3 Logo" 
              className="w-24 h-auto animate-pulse"
            />
          </div>
        )}
        
        {/* Loading Spinner */}
        <div className="mb-6 flex justify-center">
          <LoadingSpinner size="xl" />
        </div>
        
        {/* Loading Message */}
        <p className="text-white text-lg font-medium mb-2">{message}</p>
        <p className="text-gray-400 text-sm">Please wait while we connect to the blockchain...</p>
        
        {/* Animated dots */}
        <div className="flex justify-center space-x-1 mt-4">
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
};

export default PageLoader;
