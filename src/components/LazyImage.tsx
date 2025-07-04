import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
  showSpinner?: boolean;
}

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  fallback = '/delegat3.svg',
  showSpinner = true 
}: LazyImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Loading state */}
      {isLoading && showSpinner && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/5 backdrop-blur-sm rounded-lg">
          <LoadingSpinner size="sm" />
        </div>
      )}

      {/* Main image */}
      <img
        src={hasError ? fallback : src}
        alt={alt}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${className}`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
      />

      {/* Error state indicator */}
      {hasError && (
        <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full opacity-60"></div>
      )}
    </div>
  );
};

export default LazyImage;
