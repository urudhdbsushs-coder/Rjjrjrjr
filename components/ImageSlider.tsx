
import React, { useState, useEffect } from 'react';
import { SliderData } from '../types';

interface ImageSliderProps {
  slides: SliderData[];
}

const ImageSlider: React.FC<ImageSliderProps> = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  if (slides.length === 0) {
    return (
      <div className="w-full h-48 md:h-80 bg-slate-100 rounded-3xl flex items-center justify-center border-2 border-dashed border-slate-200">
        <div className="text-center">
            <i className="fas fa-images text-slate-300 text-4xl mb-3" />
            <p className="text-slate-400 text-sm font-medium">No active promotions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative w-full h-48 md:h-96 bg-slate-200 rounded-[2.5rem] shadow-2xl shadow-indigo-600/10 overflow-hidden slide-up">
      <div 
        className="flex h-full transition-transform duration-1000 ease-[cubic-bezier(0.23, 1, 0.32, 1)]" 
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="min-w-full h-full flex-shrink-0 relative">
            {slide.linkUrl ? (
                <a href={slide.linkUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                    <img src={slide.imageUrl} className="w-full h-full object-cover" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
                </a>
            ) : (
                <>
                    <img src={slide.imageUrl} className="w-full h-full object-cover" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
                </>
            )}
          </div>
        ))}
      </div>
      
      {/* Premium Pagination Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-500 ${
                currentSlide === index ? 'w-10 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      )}
      
      {/* Floating Arrows (Visible on Desktop Hover) */}
      <div className="absolute inset-y-0 left-0 right-0 hidden md:flex items-center justify-between px-6 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <button 
            onClick={() => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length)}
            className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xl text-white flex items-center justify-center hover:bg-white/40 pointer-events-auto transition-all border border-white/20 active:scale-90"
          >
              <i className="fas fa-chevron-left text-sm" />
          </button>
          <button 
            onClick={() => setCurrentSlide(prev => (prev + 1) % slides.length)}
            className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xl text-white flex items-center justify-center hover:bg-white/40 pointer-events-auto transition-all border border-white/20 active:scale-90"
          >
              <i className="fas fa-chevron-right text-sm" />
          </button>
      </div>
    </div>
  );
};

export default ImageSlider;
