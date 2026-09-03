import React, { useState } from 'react';
import { ArrowRight, Plug } from 'lucide-react';
import { DevCredit } from './DevCredit';

interface HeroIndexProps {
  onOpenRegister: () => void;
}

export const HeroIndex: React.FC<HeroIndexProps> = ({ onOpenRegister }) => {
  const [isPlugging, setIsPlugging] = useState(false);
  const [showDevModal, setShowDevModal] = useState(false);

  const handleButtonClick = () => {
    onOpenRegister();
  };

  return (
    <div className="fixed inset-0 w-full h-full flex items-end justify-center overflow-hidden select-none pb-6 sm:pb-8">
      
      {/* Background Image: object-cover to cover full viewport */}
      <img
        src="/bg.jpg"
        alt="Campismo y Naturaleza"
        className="absolute inset-0 w-full h-full object-cover object-top"
      />

      {/* Subtle Overlay: Transparent at top (#0000), subtle opacity towards the bottom */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/20 to-slate-950/60 pointer-events-none"
      />

      {/* Electric Power Shockwaves on Plug Connection */}
      {isPlugging && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="w-56 h-56 sm:w-80 sm:h-80 rounded-full border-4 border-cyan-400 bg-cyan-400/25 animate-ping opacity-90 duration-500" />
          <div className="absolute w-80 h-80 sm:w-[28rem] sm:h-[28rem] rounded-full border-2 border-blue-400/80 animate-ping opacity-70 duration-700 delay-75" />
          <div className="absolute inset-0 bg-cyan-400/20 backdrop-blur-xs animate-in fade-in duration-150" />
        </div>
      )}

      {/* Standalone 3D Game-Style Connection Button Container with Footer Credit */}
      <div className="relative z-10 p-4 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500 space-y-4">
        <div className="relative group">
          
          {/* Glowing Ambient Halo */}
          <div className={`absolute -inset-3 rounded-3xl sm:rounded-4xl transition-all duration-300 blur-lg pointer-events-none ${
            isPlugging 
              ? 'bg-cyan-400/80 shadow-[0_0_60px_#22d3ee]' 
              : 'bg-blue-600/30 group-hover:bg-cyan-500/40 group-hover:shadow-[0_0_35px_rgba(34,211,238,0.45)]'
          }`} />

          {/* 3D Bottom Base Layer (Physical Depth & Shadow) */}
          <div 
            className={`absolute inset-0 rounded-2xl sm:rounded-3xl bg-slate-950 transition-all duration-150 ${
              isPlugging
                ? 'translate-y-0 shadow-[0_0_35px_rgba(34,211,238,0.8)]'
                : 'translate-y-3 sm:translate-y-3.5 shadow-[0_14px_30px_rgba(0,0,0,0.85)] group-hover:translate-y-3.5 sm:group-hover:translate-y-4 group-active:translate-y-0 group-active:shadow-none'
            }`}
            aria-hidden="true"
          />

          {/* 3D Intermediate Mechanical Ridge (Bevel Thickness) */}
          <div 
            className={`absolute inset-0 rounded-2xl sm:rounded-3xl transition-all duration-150 ${
              isPlugging
                ? 'translate-y-0 bg-cyan-500'
                : 'translate-y-2 sm:translate-y-2.5 bg-blue-900 group-hover:translate-y-2.5 sm:group-hover:translate-y-3 group-active:translate-y-0'
            }`}
            aria-hidden="true"
          />

          {/* Main 3D Interactive Power Button */}
          <button
            onClick={handleButtonClick}
            disabled={isPlugging}
            className={`relative z-10 inline-flex items-center justify-center space-x-4 px-10 py-5 sm:px-14 sm:py-6 rounded-2xl sm:rounded-3xl text-white font-black text-xl sm:text-2xl tracking-wider transition-all duration-150 transform cursor-pointer overflow-hidden active:brightness-95 ${
              isPlugging
                ? 'translate-y-3 sm:translate-y-3.5 bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 shadow-[0_0_45px_rgba(56,189,248,0.95)] border-t-2 border-white ring-4 ring-cyan-300 scale-[0.98]'
                : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 border-t-2 border-t-cyan-300/80 border-x border-x-blue-400/40 border-b-2 border-b-slate-900 group-hover:-translate-y-1 group-active:translate-y-2 sm:group-active:translate-y-2.5'
            }`}
          >
            {/* Glossy top glass reflection */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 via-white/10 to-transparent rounded-t-2xl sm:rounded-t-3xl pointer-events-none" />

            {/* Laser scanline sweep on hover */}
            <div className={`absolute -inset-full top-0 bg-gradient-to-r from-transparent via-cyan-200/50 to-transparent transform -skew-x-20 transition-transform duration-700 ease-out pointer-events-none ${
              isPlugging ? 'translate-x-full duration-200' : '-translate-x-full group-hover:translate-x-full'
            }`} />

            {/* Left Connector Plug / Power Icon */}
            <div className="relative transform transition-transform duration-300 group-hover:scale-115 group-hover:-rotate-12 group-active:scale-95">
              {isPlugging ? (
                <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-300 drop-shadow-[0_0_12px_#fde047] animate-bounce" />
              ) : (
                <div className="p-1 rounded-xl bg-cyan-400/20 border border-cyan-300/40 shadow-inner">
                  <Plug className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-300 drop-shadow-[0_0_8px_#38bdf8]" />
                </div>
              )}
            </div>

            {/* Button Label with Deep High-Contrast Text Shadow */}
            <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-extrabold tracking-wide text-white">
              {isPlugging ? '¡CONECTANDO...!' : 'REGISTRARME'}
            </span>

            {/* Right Arrow / Pulse Bolt */}
            <div className="relative transform transition-transform duration-300 group-hover:translate-x-2 group-hover:scale-110 group-active:scale-95">
              {isPlugging ? (
                <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-300 drop-shadow-[0_0_12px_#fde047]" />
              ) : (
                <ArrowRight className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-300 drop-shadow-[0_0_8px_#38bdf8]" />
              )}
            </div>
          </button>

        </div>

       <DevCredit whatsappNumber="584122974011" email="codezardi@gmail.com" dark={false}/>

      </div>
    </div>
  );
};