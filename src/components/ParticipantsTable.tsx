import React, { useState } from 'react';
import { 
  Search, 
  FileSpreadsheet, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Compass, 
  ShieldCheck, 
  Copy, 
  Check, 
  ChevronDown, 
  UserPlus, 
  ArrowUpDown,
  Building,
  User,
  LayoutGrid,
  List,
  Mail,
  Lock,
  CheckSquare,
  Square,
  MinusSquare,
  X
} from 'lucide-react';
import { Participant, ClubCategory } from '../types';
import { exportCategoryToExcel, exportAllCategoriesToExcel, exportSelectedToExcel } from '../lib/exportExcel';

interface ParticipantsTableProps {
  participants: Participant[];
  selectedCategory: ClubCategory | 'all';
  onSelectCategory: (cat: ClubCategory | 'all') => void;
  onEditParticipant: (participant: Participant) => void;
  onDeleteParticipant: (participant: Participant) => void;
  onDeleteMultiple?: (participants: Participant[]) => void;
  onNavigateToRegister: () => void;
}

export const ParticipantsTable: React.FC<ParticipantsTableProps> = ({
  participants,
  selectedCategory,
  onSelectCategory,
  onEditParticipant,
  onDeleteParticipant,
  onDeleteMultiple,
  onNavigateToRegister,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedUserKey, setCopiedUserKey] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'user' | 'place' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showExportMenu, setShowExportMenu] = useState(false);
  
  // Multi-selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const togglePasswordReveal = (id: string) => {
    setRevealedPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyUsername = (username: string, id: string) => {
    const cleanUser = username;
    navigator.clipboard.writeText(cleanUser);
    setCopiedUserKey(id);
    setTimeout(() => setCopiedUserKey(null), 2000);
  };

  // Filter participants
  const filteredParticipants = participants.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.categoria === selectedCategory;
    const term = searchTerm.toLowerCase().trim();
    if (!term) return matchesCategory;

    const matchesSearch =
      p.usuario.toLowerCase().includes(term) ||
      p.nombre.toLowerCase().includes(term) ||
      p.apellido.toLowerCase().includes(term) ||
      p.lugar_representa.toLowerCase().includes(term) ||
      p.correo.toLowerCase().includes(term);

    return matchesCategory && matchesSearch;
  });

  // Sort participants
  const sortedParticipants = [...filteredParticipants].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'name') {
      comparison = a.nombre.localeCompare(b.nombre);
    } else if (sortBy === 'user') {
      comparison = a.usuario.localeCompare(b.usuario);
    } else if (sortBy === 'place') {
      comparison = a.lugar_representa.localeCompare(b.lugar_representa);
    } else if (sortBy === 'date') {
      comparison = new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime();
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Selection handlers
  const isAllFilteredSelected = sortedParticipants.length > 0 && sortedParticipants.every((p) => selectedIds.has(p.id));
  const isSomeFilteredSelected = sortedParticipants.some((p) => selectedIds.has(p.id)) && !isAllFilteredSelected;

  const handleToggleSelectOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleToggleSelectAll = () => {
    if (isAllFilteredSelected) {
      // Unselect all currently filtered
      setSelectedIds((prev) => {
        const next = new Set(prev);
        sortedParticipants.forEach((p) => next.delete(p.id));
        return next;
      });
    } else {
      // Select all currently filtered
      setSelectedIds((prev) => {
        const next = new Set(prev);
        sortedParticipants.forEach((p) => next.add(p.id));
        return next;
      });
    }
  };

  const handleSelectAllInClub = () => {
    setSelectedIds(new Set(participants.map((p) => p.id)));
  };

  const handleClearSelection = () => {
    setSelectedIds(new Set());
  };

  const selectedParticipants = participants.filter((p) => selectedIds.has(p.id));

  const handleDeleteSelected = () => {
    if (selectedParticipants.length === 0) return;
    if (onDeleteMultiple) {
      onDeleteMultiple(selectedParticipants);
    }
  };

  const handleExportSelected = () => {
    if (selectedParticipants.length === 0) return;
    exportSelectedToExcel(selectedParticipants);
  };

  const handleSort = (field: 'name' | 'user' | 'place' | 'date') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getCategoryBadge = (cat: ClubCategory) => {
    switch (cat) {
      case 'aventureros':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            <Sparkles className="w-3 h-3" />
            <span>Aventureros</span>
          </span>
        );
      case 'conquistadores':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Compass className="w-3 h-3" />
            <span>Conquistadores</span>
          </span>
        );
      case 'guias_mayores':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <ShieldCheck className="w-3 h-3" />
            <span>Guías Mayores</span>
          </span>
        );
    }
  };

  const getCategoryBorderColor = (cat: ClubCategory, isSelected: boolean) => {
    if (isSelected) {
      return 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/30';
    }
    switch (cat) {
      case 'aventureros':
        return 'border-sky-200 hover:border-sky-400 bg-white';
      case 'conquistadores':
        return 'border-blue-200 hover:border-blue-400 bg-white';
      case 'guias_mayores':
        return 'border-indigo-200 hover:border-indigo-400 bg-white';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative">
      
      {/* Table Header Controls */}
      <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Title & Count */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Directorio de Participantes
            </h2>
            <p className="text-xs text-slate-500">
              Mostrando {sortedParticipants.length} de {participants.length} registros oficiales
              {selectedIds.size > 0 && (
                <span className="ml-2 font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                  {selectedIds.size} seleccionado(s)
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Action buttons (View Switcher, Excel Export, New Register) */}
        <div className="flex items-center flex-wrap gap-2">
          
          {/* View Mode Toggle (Table vs Cards) */}
          <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200 shrink-0">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Vista de Tabla"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tabla</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Vista de Tarjetas"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tarjetas</span>
            </button>
          </div>

          {/* Export Dropdown */}
          <div className="relative shrink-0">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Exportar Excel</span>
              <span className="sm:hidden">Excel</span>
              <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-1.5 w-60 bg-white border border-slate-200 rounded-2xl shadow-xl z-30 py-1 text-xs animate-in fade-in zoom-in-95 duration-150">
                <button
                  onClick={() => {
                    exportAllCategoriesToExcel(participants);
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-slate-800 font-semibold flex items-center space-x-2 cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Libro Completo (Multi-Hoja)</span>
                </button>
                <div className="border-t border-slate-100 my-1"></div>
                <button
                  onClick={() => {
                    exportCategoryToExcel(participants, 'aventureros');
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center space-x-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                  <span>Hoja Aventureros</span>
                </button>
                <button
                  onClick={() => {
                    exportCategoryToExcel(participants, 'conquistadores');
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center space-x-2 cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5 text-blue-600" />
                  <span>Hoja Conquistadores</span>
                </button>
                <button
                  onClick={() => {
                    exportCategoryToExcel(participants, 'guias_mayores');
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center space-x-2 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Hoja Guías Mayores</span>
                </button>
                {selectedIds.size > 0 && (
                  <>
                    <div className="border-t border-slate-100 my-1"></div>
                    <button
                      onClick={() => {
                        handleExportSelected();
                        setShowExportMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-emerald-50 text-emerald-700 font-bold flex items-center space-x-2 cursor-pointer"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Exportar {selectedIds.size} Seleccionados</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* New Register Button */}
          <button
            onClick={onNavigateToRegister}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Nuevo Registro</span>
            <span className="sm:hidden">Nuevo</span>
          </button>

        </div>

      </div>

      {/* Dedicated Search and Category Filters Section */}
      <div className="bg-slate-50/80 border-b border-slate-200 px-4 sm:px-6 py-4 space-y-3">
        
        {/* Row 1: Search Input */}
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por usuario, nombre, lugar o correo..."
            className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all shadow-2xs"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold p-1 cursor-pointer"
              title="Limpiar búsqueda"
            >
              ✕
            </button>
          )}
        </div>

        {/* Row 2: Category Filter Chips & Selection Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-0.5">
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 font-mono">
              Filtrar:
            </span>

            <button
              onClick={() => onSelectCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200'
              }`}
            >
              Todos ({participants.length})
            </button>

            <button
              onClick={() => onSelectCategory('aventureros')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === 'aventureros'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-sky-700 hover:border-sky-200'
              }`}
            >
              Aventureros ({participants.filter(p => p.categoria === 'aventureros').length})
            </button>

            <button
              onClick={() => onSelectCategory('conquistadores')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === 'conquistadores'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-blue-700 hover:border-blue-200'
              }`}
            >
              Conquistadores ({participants.filter(p => p.categoria === 'conquistadores').length})
            </button>

            <button
              onClick={() => onSelectCategory('guias_mayores')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === 'guias_mayores'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-indigo-700 hover:border-indigo-200'
              }`}
            >
              Guías Mayores ({participants.filter(p => p.categoria === 'guias_mayores').length})
            </button>
          </div>

          {/* Quick Select All Button */}
          {sortedParticipants.length > 0 && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleToggleSelectAll}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold cursor-pointer shadow-2xs transition-all"
              >
                {isAllFilteredSelected ? (
                  <>
                    <MinusSquare className="w-3.5 h-3.5 text-blue-600" />
                    <span>Deseleccionar Visibles</span>
                  </>
                ) : (
                  <>
                    <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
                    <span>Seleccionar Visibles ({sortedParticipants.length})</span>
                  </>
                )}
              </button>
              
              {participants.length > sortedParticipants.length && (
                <button
                  onClick={handleSelectAllInClub}
                  className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-all"
                  title="Seleccionar los registros de todas las categorías"
                >
                  <span>Todos ({participants.length})</span>
                </button>
              )}
            </div>
          )}
        </div>

      </div>

      {/* FLOATING / STICKY BATCH ACTIONS BAR (Appears when 1+ are selected) */}
      {selectedIds.size > 0 && (
        <div className="sticky top-0 z-20 bg-blue-900 text-white px-4 sm:px-6 py-3 shadow-lg flex flex-wrap items-center justify-between gap-3 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center space-x-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-700 text-white font-mono text-xs font-bold">
              {selectedIds.size}
            </span>
            <div className="text-xs sm:text-sm font-semibold">
              <span>{selectedIds.size} participante{selectedIds.size > 1 ? 's' : ''} seleccionado{selectedIds.size > 1 ? 's' : ''}</span>
              <span className="text-blue-300 ml-2 hidden md:inline text-xs">
                (de {participants.length} totales)
              </span>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={handleExportSelected}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer shadow-xs transition-all"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Exportar Excel ({selectedIds.size})</span>
            </button>

            <button
              onClick={handleDeleteSelected}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer shadow-xs transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Eliminar ({selectedIds.size})</span>
            </button>

            <button
              onClick={handleClearSelection}
              className="p-1.5 rounded-xl bg-blue-800 hover:bg-blue-700 text-blue-200 hover:text-white cursor-pointer transition-all ml-1"
              title="Cancelar selección"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* VIEW 1: TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="overflow-x-auto animate-in fade-in duration-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/80 text-slate-700 text-[11px] font-bold uppercase tracking-wider font-mono border-b border-slate-200">
                {/* Checkbox Header */}
                <th className="py-3 px-3 w-10 text-center">
                  <button
                    onClick={handleToggleSelectAll}
                    className="p-1 text-slate-500 hover:text-blue-600 cursor-pointer rounded-md focus:outline-hidden"
                    title={isAllFilteredSelected ? "Deseleccionar todos" : "Seleccionar todos"}
                  >
                    {isAllFilteredSelected ? (
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                    ) : isSomeFilteredSelected ? (
                      <MinusSquare className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-2">#</th>
                <th 
                  className="py-3 px-4 cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort('user')}
                >
                  <div className="flex items-center space-x-1">
                    <span>1. Usuario</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  className="py-3 px-4 cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center space-x-1">
                    <span>2. Nombre y Apellido</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  className="py-3 px-4 cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort('place')}
                >
                  <div className="flex items-center space-x-1">
                    <span>3. Lugar que Representa</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4">4. Correo</th>
                <th className="py-3 px-4">5. Contraseña</th>
                <th className="py-3 px-4">Categoría</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-sans">
              {sortedParticipants.length > 0 ? (
                sortedParticipants.map((p, idx) => {
                  const isPasswordRevealed = Boolean(revealedPasswords[p.id]);
                  const isCopied = copiedId === p.id;
                  const isUserCopied = copiedUserKey === p.id;
                  const isSelected = selectedIds.has(p.id);

                  return (
                    <tr 
                      key={p.id}
                      className={`transition-colors ${
                        isSelected 
                          ? 'bg-blue-50/70 hover:bg-blue-50' 
                          : 'hover:bg-slate-50/80'
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => handleToggleSelectOne(p.id)}
                          className="p-1 text-slate-400 hover:text-blue-600 cursor-pointer rounded-md focus:outline-hidden"
                          title={isSelected ? "Deseleccionar" : "Seleccionar"}
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400" />
                          )}
                        </button>
                      </td>

                      {/* Index */}
                      <td className="py-3 px-2 text-slate-400 font-mono text-[11px]">
                        {idx + 1}
                      </td>

                      {/* 1. Usuario */}
                      <td className="py-3 px-4">
                        <div className="inline-flex items-center space-x-1.5 font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 group">
                          <span>{p.correo}</span>
                          <button
                            onClick={() => copyUsername(p.correo, p.id)}
                            className="text-slate-400 hover:text-blue-600 p-0.5 cursor-pointer opacity-70 group-hover:opacity-100"
                            title="Copiar usuario"
                          >
                            {isUserCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </td>

                      {/* 2. Nombre & Apellido */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">
                          {p.nombre} {p.apellido}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {p.rango || 'Participante'}
                        </div>
                      </td>

                      {/* 3. Lugar que representa */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1.5 text-slate-800">
                          <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[200px]" title={p.lugar_representa}>
                            {p.lugar_representa}
                          </span>
                        </div>
                      </td>

                      {/* 4. Correo */}
                      <td className="py-3 px-4 font-mono text-slate-600 text-[11px]">
                        <a 
                          href={`mailto:${p.correo}`}
                          className="hover:text-blue-600 hover:underline"
                          title={p.correo}
                        >
                          {p.correo}
                        </a>
                      </td>

                      {/* 5. Contraseña */}
                      <td className="py-3 px-4 font-mono">
                        <div className="inline-flex items-center space-x-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
                          <span className="text-slate-700 text-[11px]">
                            {isPasswordRevealed ? p.contrasena : '••••••••'}
                          </span>
                          <button
                            onClick={() => togglePasswordReveal(p.id)}
                            className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                            title={isPasswordRevealed ? 'Ocultar contraseña' : 'Ver contraseña'}
                          >
                            {isPasswordRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => copyToClipboard(p.contrasena, p.id)}
                            className="text-slate-400 hover:text-blue-600 p-0.5 cursor-pointer"
                            title="Copiar contraseña"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>

                      {/* Categoría */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {getCategoryBadge(p.categoria)}
                      </td>

                      {/* Acciones */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center space-x-1">
                          <button
                            onClick={() => onEditParticipant(p)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                            title="Editar registro"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteParticipant(p)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Eliminar registro"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <User className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-semibold text-slate-700">
                        No se encontraron participantes con los filtros actuales
                      </p>
                      <button
                        onClick={onNavigateToRegister}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                      >
                        + Inscribir Nuevo Participante
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* VIEW 2: CARDS / GRID VIEW */}
      {viewMode === 'cards' && (
        <div className="p-4 sm:p-6 bg-slate-50/50 animate-in fade-in duration-200">
          {sortedParticipants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {sortedParticipants.map((p) => {
                const isPasswordRevealed = Boolean(revealedPasswords[p.id]);
                const isCopied = copiedId === p.id;
                const isUserCopied = copiedUserKey === p.id;
                const isSelected = selectedIds.has(p.id);

                const initials = `${p.nombre.charAt(0)}${p.apellido.charAt(0)}`.toUpperCase();

                return (
                  <div
                    key={p.id}
                    className={`rounded-2xl border p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative ${getCategoryBorderColor(p.categoria, isSelected)}`}
                  >
                    {/* Card Top: Checkbox + Category Badge + Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleToggleSelectOne(p.id)}
                          className="p-1 text-slate-400 hover:text-blue-600 cursor-pointer rounded-md focus:outline-hidden"
                          title={isSelected ? "Deseleccionar" : "Seleccionar"}
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400" />
                          )}
                        </button>
                        {getCategoryBadge(p.categoria)}
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => onEditParticipant(p)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                          title="Editar registro"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteParticipant(p)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Eliminar registro"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Card Profile Info */}
                    <div className="flex items-start space-x-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-slate-900 truncate">
                          {p.nombre} {p.apellido}
                        </h3>
                        <div className="flex items-center space-x-1.5 mt-0.5">
                          <button
                            onClick={() => copyUsername(p.correo, p.id)}
                            className="inline-flex items-center space-x-1 font-mono font-semibold text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 hover:bg-blue-100 transition-colors cursor-pointer"
                            title="Copiar usuario"
                          >
                            <span>{p.correo}</span>
                            {isUserCopied ? (
                              <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                            ) : (
                              <Copy className="w-3 h-3 text-blue-400 shrink-0" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Card Details: Lugar, Correo, Contraseña */}
                    <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                      
                      {/* Lugar */}
                      <div className="flex items-center space-x-2 text-slate-700">
                        <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate font-medium" title={p.lugar_representa}>
                          {p.lugar_representa}
                        </span>
                      </div>

                      {/* Correo */}
                      <div className="flex items-center space-x-2 text-slate-600 font-mono">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <a 
                          href={`mailto:${p.correo}`} 
                          className="truncate hover:text-blue-600 hover:underline"
                          title={p.correo}
                        >
                          {p.correo}
                        </a>
                      </div>

                      {/* Contraseña */}
                      <div className="flex items-center justify-between bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
                        <div className="flex items-center space-x-2">
                          <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-mono text-slate-800 text-[11px] font-semibold">
                            {isPasswordRevealed ? p.contrasena : '••••••••'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => togglePasswordReveal(p.id)}
                            className="p-1 rounded-md text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                            title={isPasswordRevealed ? 'Ocultar contraseña' : 'Ver contraseña'}
                          >
                            {isPasswordRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => copyToClipboard(p.contrasena, p.id)}
                            className="p-1 rounded-md text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                            title="Copiar contraseña"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500">
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <User className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  No se encontraron participantes con los filtros actuales
                </p>
                <button
                  onClick={onNavigateToRegister}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  + Inscribir Nuevo Participante
                </button>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

