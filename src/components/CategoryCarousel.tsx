import React, { useState } from 'react';
import { 
  Sparkles, 
  Compass, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight,
  Sparkle,
  LogIn
} from 'lucide-react';
import { ClubCategory } from '../types';
import { CATEGORY_CONFIGS, CATEGORIES_LIST } from '../data/categoryConfig';
import { sound } from '../lib/soundEffects';

interface CategoryCarouselProps {
  onEnterCategory: (category: ClubCategory) => void;
}

export const CategoryCarousel: React.FC<CategoryCarouselProps> = ({
  onEnterCategory,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    sound.playClick();
    setActiveIndex((prev) => (prev - 1 + CATEGORIES_LIST.length) % CATEGORIES_LIST.length);
  };

  const handleNext = () => {
    sound.playClick();
    setActiveIndex((prev) => (prev + 1) % CATEGORIES_LIST.length);
  };

  const getCategoryIcon = (id: ClubCategory) => {
    switch (id) {
      case 'aventureros':
        return <Sparkles className="w-5 h-5" />;
      case 'conquistadores':
        return <Compass className="w-5 h-5" />;
      case 'guias_mayores':
        return <ShieldCheck className="w-5 h-5" />;
    }
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 py-8 sm:py-16 flex flex-col items-center justify-center min-h-[75vh]">
      
      {/* Title */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          Club <span className="text-blue-600">Quest</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-500 mt-2 font-medium">
          Selecciona tu categoría para registrarte
        </p>
      </div>

      {/* Desktop 3-Cards Grid / Mobile Carousel */}
      <div className="w-full relative">
        
        {/* Navigation Arrows for Mobile / Compact */}
        <div className="flex md:hidden items-center justify-between absolute -top-12 right-2 space-x-2 z-20">
          <button
            onClick={handlePrev}
            className="p-2 rounded-xl bg-white border border-slate-200 shadow-xs text-slate-700 hover:text-blue-600 cursor-pointer"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-2 rounded-xl bg-white border border-slate-200 shadow-xs text-slate-700 hover:text-blue-600 cursor-pointer"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {CATEGORIES_LIST.map((catKey, index) => {
            const config = CATEGORY_CONFIGS[catKey];
            const isCurrentMobile = index === activeIndex;

            return (
              <div
                key={catKey}
                className={`relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group flex flex-col justify-end min-h-[440px] sm:min-h-[500px] border border-slate-200/60 ${
                  isCurrentMobile ? 'block' : 'hidden md:flex'
                }`}
              >
                {/* Background Image */}
                <img
                  src={config.backgroundImage}
                  alt={config.name}
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />

                {/* Dark Gradient Overlay for text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-900/20" />

                {/* Top Badge */}
                <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-10">
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold tracking-wide">
                    {getCategoryIcon(catKey)}
                    <span>{config.badgeLabel}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-mono border border-white/10">
                    {config.ageRange}
                  </span>
                </div>

                {/* Card Content & Action Button */}
                <div className="relative z-10 p-6 sm:p-7 flex flex-col space-y-4">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-xs">
                      {config.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-200 mt-1 line-clamp-2 leading-relaxed">
                      {config.description}
                    </p>
                  </div>

                  {/* Motto pill */}
                  <div className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-blue-100 italic">
                    "{config.motto}"
                  </div>

                  {/* "Entrar" Button over the card */}
                  <button
                    onClick={() => {
                      sound.playClick();
                      onEnterCategory(catKey);
                    }}
                    className="w-full py-3.5 px-6 rounded-2xl bg-white hover:bg-blue-50 text-blue-700 font-bold text-sm sm:text-base shadow-xl transition-all flex items-center justify-center space-x-2 group-hover:bg-blue-600 group-hover:text-white cursor-pointer active:scale-[0.98]"
                  >
                    <span>Entrar</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Pagination Dots */}
        <div className="flex md:hidden justify-center items-center space-x-2 mt-5">
          {CATEGORIES_LIST.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                sound.playClick();
                setActiveIndex(idx);
              }}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                activeIndex === idx ? 'w-6 bg-blue-600' : 'w-2 bg-slate-300'
              }`}
              aria-label={`Ir a tarjeta ${idx + 1}`}
            />
          ))}
        </div>

      </div>

    </div>
  );
};
