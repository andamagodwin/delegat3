import { useState, useEffect } from 'react';

interface Steward {
  name: string;
  role: string;
  avatar: string;
  description?: string;
}

interface StewardsCarouselProps {
  stewards: Steward[];
}

const StewardsCarousel = ({ stewards }: StewardsCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Duplicate stewards for infinite effect
  const extendedStewards = [...stewards, ...stewards, ...stewards];
  const totalSlides = extendedStewards.length;

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isHovered, totalSlides]);

  // Reset to middle section when reaching the end to create infinite effect
  useEffect(() => {
    if (currentIndex >= stewards.length * 2) {
      const timeout = setTimeout(() => {
        setCurrentIndex(stewards.length);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, stewards.length]);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index + stewards.length);
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      {/* Carousel Container */}
      <div 
        className="overflow-hidden rounded-2xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ 
            transform: `translateX(-${(currentIndex * 100) / 5}%)`,
            width: `${(totalSlides * 100) / 5}%`
          }}
        >
          {extendedStewards.map((steward, index) => (
            <div 
              key={`${steward.name}-${index}`}
              className="w-1/5 px-3"
            >
              <div className="group bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-primary-400/50 transition-all duration-300 transform hover:scale-105 hover:bg-white/15 cursor-pointer">
                {/* Avatar */}
                <div className="text-4xl mb-4 text-center group-hover:scale-110 transition-transform duration-300">
                  {steward.avatar}
                </div>
                
                {/* Name */}
                <h4 className="text-white font-semibold text-center mb-2 group-hover:text-primary-300 transition-colors duration-300">
                  {steward.name}
                </h4>
                
                {/* Role */}
                <p className="text-gray-400 text-sm text-center group-hover:text-gray-300 transition-colors duration-300">
                  {steward.role}
                </p>

                {/* Hover Indicator */}
                <div className="mt-4 h-1 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-x-0 group-hover:scale-x-100"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center mt-8 space-x-2">
        {stewards.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              Math.floor((currentIndex % (stewards.length * 2)) / stewards.length) === 0 && 
              (currentIndex % stewards.length) === index
                ? 'bg-primary-500 scale-125' 
                : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Side Gradients for infinite effect */}
      <div className="absolute left-0 top-0 w-8 h-full bg-gradient-to-r from-slate-900 to-transparent pointer-events-none z-10"></div>
      <div className="absolute right-0 top-0 w-8 h-full bg-gradient-to-l from-slate-900 to-transparent pointer-events-none z-10"></div>
    </div>
  );
};

export default StewardsCarousel;
