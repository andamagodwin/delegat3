interface SkeletonLoaderProps {
  variant?: 'text' | 'card' | 'steward' | 'button';
  className?: string;
  lines?: number;
}

const SkeletonLoader = ({ variant = 'text', className = '', lines = 1 }: SkeletonLoaderProps) => {
  const baseClasses = "animate-pulse bg-gradient-to-r from-white/10 to-white/5 rounded";

  if (variant === 'card') {
    return (
      <div className={`bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 ${className}`}>
        <div className={`${baseClasses} h-12 w-12 rounded-full mb-4`}></div>
        <div className={`${baseClasses} h-6 w-3/4 mb-3`}></div>
        <div className={`${baseClasses} h-4 w-full mb-2`}></div>
        <div className={`${baseClasses} h-4 w-2/3`}></div>
      </div>
    );
  }

  if (variant === 'steward') {
    return (
      <div className={`bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 ${className}`}>
        <div className={`${baseClasses} h-12 w-12 rounded-full mx-auto mb-4`}></div>
        <div className={`${baseClasses} h-5 w-3/4 mx-auto mb-2`}></div>
        <div className={`${baseClasses} h-4 w-1/2 mx-auto`}></div>
      </div>
    );
  }

  if (variant === 'button') {
    return (
      <div className={`${baseClasses} h-12 w-32 rounded-full ${className}`}></div>
    );
  }

  // Text variant (default)
  return (
    <div className={className}>
      {Array.from({ length: lines }).map((_, index) => (
        <div 
          key={index}
          className={`${baseClasses} h-4 mb-2 ${
            index === lines - 1 ? 'w-2/3' : 'w-full'
          }`}
        ></div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
