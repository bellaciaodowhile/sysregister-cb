import React from 'react';
import { 
  FileSpreadsheet, 
  X, 
  Sparkles, 
  Compass, 
  ShieldCheck, 
  Download, 
  Layers, 
  CheckCircle2
} from 'lucide-react';
import { Participant, ClubCategory } from '../types';
import { exportAllCategoriesToExcel, exportCategoryToExcel } from '../lib/exportExcel';

interface ExportExcelModalProps {
  isOpen: boolean;
  onClose: () => void;
  participants: Participant[];
}

export const ExportExcelModal: React.FC<ExportExcelModalProps> = ({
  isOpen,
  onClose,
  participants,
}) => {
  if (!isOpen) return null;

  const aventurerosCount = participants.filter((p) => p.categoria === 'aventureros').length;
  const conquistadoresCount = participants.filter((p) => p.categoria === 'conquistadores').length;
  const guiasMayoresCount = participants.filter((p) => p.categoria === 'guias_mayores').length;

  const handleExportAll = () => {
    exportAllCategoriesToExcel(participants);
    onClose();
  };

  const handleExportCategory = (cat: ClubCategory) => {
    exportCategoryToExcel(participants, cat);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-blue-700 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-white/10 text-white">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">Exportación a Excel Oficial</h3>
              <p className="text-xs text-emerald-100">Hojas de cálculo .xlsx con formato estructurado</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
            Las columnas se exportan en el orden estricto: <strong>1. Usuario</strong>, <strong>2. Nombre</strong>, <strong>3. Apellido</strong>, <strong>4. Lugar que representa</strong>, <strong>5. Correo</strong>, y <strong>6. Contraseña</strong>.
          </div>

          {/* Option 1: Full Multi-Sheet Workbook */}
          <div 
            onClick={handleExportAll}
            className="p-4 rounded-2xl border-2 border-emerald-500/40 hover:border-emerald-600 bg-emerald-50/40 hover:bg-emerald-50/80 transition-all cursor-pointer flex items-center justify-between group shadow-xs"
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-800">
                  Libro Completo Multi-Hoja (Recomendado)
                </h4>
                <p className="text-xs text-slate-600">
                  Genera un archivo con 4 hojas separadas: Consolidado General, Aventureros, Conquistadores y Guías Mayores.
                </p>
              </div>
            </div>

            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-xl shrink-0">
              {participants.length} Total
            </span>
          </div>

          {/* Individual Category Exports */}
          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              O exportar por hoja individual:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              
              {/* Aventureros */}
              <button
                onClick={() => handleExportCategory('aventureros')}
                className="p-3 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50/60 transition-all text-left flex flex-col justify-between cursor-pointer"
              >
                <div className="flex items-center space-x-1.5 text-xs font-bold text-sky-700 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Aventureros</span>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">
                  {aventurerosCount} inscritos
                </span>
              </button>

              {/* Conquistadores */}
              <button
                onClick={() => handleExportCategory('conquistadores')}
                className="p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/60 transition-all text-left flex flex-col justify-between cursor-pointer"
              >
                <div className="flex items-center space-x-1.5 text-xs font-bold text-blue-700 mb-1">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Conquistadores</span>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">
                  {conquistadoresCount} inscritos
                </span>
              </button>

              {/* Guías Mayores */}
              <button
                onClick={() => handleExportCategory('guias_mayores')}
                className="p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/60 transition-all text-left flex flex-col justify-between cursor-pointer"
              >
                <div className="flex items-center space-x-1.5 text-xs font-bold text-indigo-700 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Guías Mayores</span>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">
                  {guiasMayoresCount} inscritos
                </span>
              </button>

            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancelar
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
