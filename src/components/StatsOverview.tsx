import React from 'react';
import { 
  Users, 
  Sparkles, 
  Compass, 
  ShieldCheck 
} from 'lucide-react';
import { Participant, ClubCategory } from '../types';
import { sound } from '../lib/soundEffects';

interface StatsOverviewProps {
  participants: Participant[];
  selectedCategory: ClubCategory | 'all';
  onSelectCategory: (cat: ClubCategory | 'all') => void;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  participants,
  selectedCategory,
  onSelectCategory,
}) => {
  const total = participants.length;
  const aventurerosCount = participants.filter((p) => p.categoria === 'aventureros').length;
  const conquistadoresCount = participants.filter((p) => p.categoria === 'conquistadores').length;
  const guiasMayoresCount = participants.filter((p) => p.categoria === 'guias_mayores').length;

  const handleCategoryClick = (cat: ClubCategory | 'all') => {
    sound.playClick();
    onSelectCategory(cat);
  };

  return (
    <div className="space-y-4">
      {/* 4 Summary Metric Cards (Clean without percentages) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Metric Card */}
        <div 
          onClick={() => handleCategoryClick('all')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer bg-white ${
            selectedCategory === 'all'
              ? 'border-blue-600 shadow-md ring-2 ring-blue-100'
              : 'border-slate-200 hover:border-blue-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total General</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900">{total}</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Todas las divisiones activas</p>
        </div>

        {/* 1. Aventureros Metric Card */}
        <div 
          onClick={() => handleCategoryClick('aventureros')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer bg-white ${
            selectedCategory === 'aventureros'
              ? 'border-sky-600 shadow-md ring-2 ring-sky-100'
              : 'border-slate-200 hover:border-sky-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">Aventureros</span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900">{aventurerosCount}</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">6 a 9 años • Exploradores</p>
        </div>

        {/* 2. Conquistadores Metric Card */}
        <div 
          onClick={() => handleCategoryClick('conquistadores')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer bg-white ${
            selectedCategory === 'conquistadores'
              ? 'border-blue-600 shadow-md ring-2 ring-blue-100'
              : 'border-slate-200 hover:border-blue-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Conquistadores</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900">{conquistadoresCount}</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">10 a 15 años • Juveniles</p>
        </div>

        {/* 3. Guías Mayores Metric Card */}
        <div 
          onClick={() => handleCategoryClick('guias_mayores')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer bg-white ${
            selectedCategory === 'guias_mayores'
              ? 'border-indigo-600 shadow-md ring-2 ring-indigo-100'
              : 'border-slate-200 hover:border-indigo-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Guías Mayores</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900">{guiasMayoresCount}</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">16+ años • Liderazgo</p>
        </div>

      </div>
    </div>
  );
};
