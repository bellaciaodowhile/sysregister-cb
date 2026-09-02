import React from 'react';
import { 
  Shield, 
  UserPlus, 
  LayoutDashboard, 
  Database, 
  FileSpreadsheet, 
  Volume2, 
  VolumeX,
  Compass,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { sound } from '../lib/soundEffects';

interface NavbarProps {
  currentPath: '/' | '/panel';
  onNavigate: (path: '/' | '/panel') => void;
  totalParticipants: number;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  onOpenSupabaseModal: () => void;
  onOpenExportModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  totalParticipants,
  soundEnabled,
  setSoundEnabled,
  onOpenSupabaseModal,
  onOpenExportModal,
}) => {
  const toggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    sound.setEnabled(nextVal);
    if (nextVal) sound.playClick();
  };

  const handleNavClick = (path: '/' | '/panel') => {
    sound.playSwitch();
    onNavigate(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Brand Logo & Title */}
          <div 
            onClick={() => handleNavClick('/')}
            className="flex items-center space-x-3 cursor-pointer group select-none py-1"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600 font-mono">
                  JA • Sistema Oficial
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              </div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight">
                Registro de <span className="text-blue-600">Clubes</span>
              </h1>
            </div>
          </div>

          {/* Navigation Items (Clean White / Blue Minimalist) */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Nav Links */}
            <nav className="flex items-center space-x-1 sm:space-x-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
              
              {/* 1. Registro / Index */}
              <button
                id="nav-registro-btn"
                onClick={() => handleNavClick('/')}
                className={`flex items-center space-x-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  currentPath === '/'
                    ? 'bg-white text-blue-600 shadow-sm border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <UserPlus className="w-4 h-4 text-blue-600" />
                <span>Inscripción</span>
              </button>

              {/* 2. Panel / /panel */}
              <button
                id="nav-panel-btn"
                onClick={() => handleNavClick('/panel')}
                className={`flex items-center space-x-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  currentPath === '/panel'
                    ? 'bg-white text-blue-600 shadow-sm border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-blue-600" />
                <span>Panel</span>
                <span className="hidden sm:inline-flex text-[11px] font-mono px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold">
                  {totalParticipants}
                </span>
              </button>

            </nav>

            {/* Quick Modals Triggers: Supabase & Excel */}
            <div className="hidden lg:flex items-center space-x-2 border-l border-slate-200 pl-3">
              
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenSupabaseModal();
                }}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-slate-700 hover:text-blue-700 text-xs font-semibold transition-all cursor-pointer"
                title="Ver Estructura SQL de la Base de Datos"
              >
                <Database className="w-3.5 h-3.5 text-blue-600" />
                <span>Estructura SQL</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onOpenExportModal();
                }}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 text-slate-700 hover:text-emerald-700 text-xs font-semibold transition-all cursor-pointer"
                title="Exportar a Excel"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Excel</span>
              </button>

            </div>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                soundEnabled
                  ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200'
                  : 'bg-slate-100 border-slate-200 text-slate-400'
              }`}
              title={soundEnabled ? 'Silenciar Efectos de Sonido' : 'Activar Efectos de Sonido'}
              aria-label="Toggle Audio"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
