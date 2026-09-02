import React from 'react';
import { 
  Sparkles, 
  Compass, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight, 
  ArrowDownCircle, 
  Users, 
  Award,
  BookOpen,
  MapPin,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { ClubCategory } from '../types';
import { CATEGORY_CONFIGS, CATEGORIES_LIST } from '../data/categoryConfig';
import { sound } from '../lib/soundEffects';

interface CategorySliderProps {
  activeCategory: ClubCategory;
  onSelectCategory: (cat: ClubCategory) => void;
  onScrollToForm?: () => void;
}

export const CategorySlider: React.FC<CategorySliderProps> = ({
  activeCategory,
  onSelectCategory,
  onScrollToForm,
}) => {
  const currentIndex = CATEGORIES_LIST.indexOf(activeCategory);
  const currentConfig = CATEGORY_CONFIGS[activeCategory] || CATEGORY_CONFIGS.aventureros;

  const handlePrev = () => {
    sound.playClick();
    const prevIndex = (currentIndex - 1 + CATEGORIES_LIST.length) % CATEGORIES_LIST.length;
    onSelectCategory(CATEGORIES_LIST[prevIndex]);
  };

  const handleNext = () => {
    sound.playClick();
    const nextIndex = (currentIndex + 1) % CATEGORIES_LIST.length;
    onSelectCategory(CATEGORIES_LIST[nextIndex]);
  };

  const getCategoryIcon = (id: ClubCategory, className: string = 'w-6 h-6') => {
    switch (id) {
      case 'aventureros':
        return <Sparkles className={className} />;
      case 'conquistadores':
        return <Compass className={className} />;
      case 'guias_mayores':
        return <ShieldCheck className={className} />;
    }
  };

  return (
    <section className="relative w-full py-4 sm:py-8">
      
      {/* Background Soft Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-blue-100/60 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Header Information & Tagline */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 px-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
          <span>Plataforma de Inscripción Oficial</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Explora y Selecciona tu <span className="text-blue-600">Categoría</span>
        </h2>
        <p className="mt-2.5 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Elige la sección correspondiente para completar el formulario oficial de inscripción. Desliza entre <strong>Aventureros</strong>, <strong>Conquistadores</strong> y <strong>Guías Mayores</strong>.
        </p>
      </div>

      {/* Main 3D-like / Card Showcase Slider Area */}
      <div className="relative max-w-5xl mx-auto px-4">
        
        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          aria-label="Categoría anterior"
          className="absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white border border-slate-200 shadow-lg text-slate-700 hover:text-blue-600 hover:border-blue-300 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handleNext}
          aria-label="Siguiente categoría"
          className="absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white border border-slate-200 shadow-lg text-slate-700 hover:text-blue-600 hover:border-blue-300 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Carousel Cards Track */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch py-2">
          {CATEGORIES_LIST.map((catKey, idx) => {
            const config = CATEGORY_CONFIGS[catKey];
            const isSelected = activeCategory === catKey;

            return (
              <div
                key={catKey}
                onClick={() => {
                  sound.playClick();
                  onSelectCategory(catKey);
                }}
                className={`group relative rounded-3xl p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-2 border-blue-600 shadow-2xl shadow-blue-500/15 md:-translate-y-2 ring-4 ring-blue-50'
                    : 'bg-white/80 hover:bg-white border border-slate-200 hover:border-blue-300 shadow-md opacity-85 hover:opacity-100'
                }`}
              >
                {/* Order Tag & Age Pill */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {config.badgeLabel}
                    </span>
                    <span className="text-xs font-semibold font-mono text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">
                      {config.ageRange}
                    </span>
                  </div>

                  {/* Card Visual Hero with Icon & Title */}
                  <div className="flex items-center space-x-3.5 mb-3">
                    <div className={`w-13 h-13 rounded-2xl flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : 'bg-blue-50 text-blue-600 border border-blue-150'
                    }`}>
                      {getCategoryIcon(catKey, 'w-6 h-6')}
                    </div>
                    <div>
                      <h3 className={`text-xl sm:text-2xl font-black tracking-tight leading-none ${
                        isSelected ? 'text-slate-900' : 'text-slate-700'
                      }`}>
                        {config.name}
                      </h3>
                      <p className="text-xs text-blue-600 font-medium mt-1">
                        {config.ageRange}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    {config.description}
                  </p>

                  {/* Motto / Tagline box */}
                  <div className={`p-3 rounded-xl border text-xs mb-4 italic ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-200 text-blue-900'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}>
                    "{config.motto}"
                  </div>

                  {/* Highlights Bullet List */}
                  <div className="space-y-2 mb-4">
                    {config.keyFeatures.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center space-x-2 text-xs text-slate-700">
                        <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Selection Indicator */}
                <div className="pt-3 border-t border-slate-100 mt-2">
                  <button
                    type="button"
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20'
                        : 'bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700'
                    }`}
                  >
                    <span>{isSelected ? '✓ Categoría Seleccionada' : 'Seleccionar Esta Categoría'}</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom Arc / Dial Navigation Bar (Inspired by the Reference Image) */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col items-center">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 font-mono">
            Control Rápido de Categoría
          </div>

          <div className="inline-flex p-1.5 rounded-2xl bg-white border border-slate-200 shadow-md gap-1.5 sm:gap-2">
            {CATEGORIES_LIST.map((catKey, index) => {
              const isSelected = activeCategory === catKey;
              const config = CATEGORY_CONFIGS[catKey];

              return (
                <button
                  key={catKey}
                  onClick={() => {
                    sound.playClick();
                    onSelectCategory(catKey);
                  }}
                  className={`flex items-center space-x-2 px-3.5 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 scale-102'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/60'
                  }`}
                >
                  {getCategoryIcon(catKey, 'w-4 h-4')}
                  <span>{config.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                    isSelected ? 'bg-blue-700 text-blue-100' : 'bg-slate-100 text-slate-500'
                  }`}>
                    #{index + 1}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick jump to form */}
          {onScrollToForm && (
            <button
              onClick={onScrollToForm}
              className="mt-5 inline-flex items-center space-x-2 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50/80 hover:bg-blue-100 border border-blue-200 px-4 py-2 rounded-full transition-colors cursor-pointer"
            >
              <ArrowDownCircle className="w-4 h-4 animate-bounce" />
              <span>Ir directamente al Formulario de Inscripción</span>
            </button>
          )}

        </div>

      </div>

    </section>
  );
};
