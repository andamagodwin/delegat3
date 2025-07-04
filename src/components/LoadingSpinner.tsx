interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const LoadingSpinner = ({ size = 'md', className = '' }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border-4 border-primary-200/30"></div>
      
      {/* Spinning gradient ring */}
      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-500 border-r-primary-400 animate-spin"></div>
      
      {/* Inner glow */}
      <div className="absolute inset-2 rounded-full bg-gradient-to-r from-primary-500/20 to-primary-600/20 blur-sm"></div>
    </div>
  );
};

export default LoadingSpinner;
