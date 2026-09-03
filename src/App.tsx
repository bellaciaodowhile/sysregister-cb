import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HeroIndex } from './components/HeroIndex';
import { DevCredit } from './components/DevCredit'
import { RegistrationModal } from './components/RegistrationModal';
import { StatsOverview } from './components/StatsOverview';
import { ParticipantsTable } from './components/ParticipantsTable';
import { EditParticipantModal } from './components/EditParticipantModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { SupabaseModal } from './components/SupabaseModal';
import { ExportExcelModal } from './components/ExportExcelModal';
import { Participant, ClubCategory, ParticipantFormData } from './types';
import { getSupabaseCredentials } from './lib/supabaseClient';
import {
  fetchParticipantsFromSupabase,
  insertParticipantToSupabase,
  updateParticipantInSupabase,
  deleteParticipantFromSupabase,
  deleteMultipleParticipantsFromSupabase,
  subscribeToSupabaseParticipants,
} from './lib/participantsService';
import { 
  CheckCircle2, 
  LayoutDashboard, 
  ArrowLeft, 
  FileSpreadsheet, 
  Database,
  RefreshCw,
  AlertCircle,
  Plus,
  UserCheck,
  X,
  Sparkles,
  Compass,
  ShieldCheck
} from 'lucide-react';

export interface ToastNotification {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'info' | 'delete' | 'error' | 'new_member';
  user?: string;
  category?: ClubCategory;
  place?: string;
  timestamp: string;
}

export default function App() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dbError, setDbError] = useState<string | null>(null);
  const [dbStatus, setDbStatus] = useState<{ isConfigured: boolean; table?: string }>({ isConfigured: false });

  // Floating notifications stack
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);

  // Client-side routing state supporting '/' (Carousel Index) and '/panel' (Admin Directory)
  const [currentPath, setCurrentPath] = useState<'/' | '/panel'>(() => {
    const pathname = window.location.pathname;
    const hash = window.location.hash;
    if (pathname.includes('/panel') || hash.includes('panel')) {
      return '/panel';
    }
    return '/';
  });

  // Category chosen when opening Registration Modal
  const [modalCategory, setModalCategory] = useState<ClubCategory>('aventureros');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedTableCategory, setSelectedTableCategory] = useState<ClubCategory | 'all'>('all');

  // Modals state
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
  const [deletingParticipant, setDeletingParticipant] = useState<Participant | null>(null);
  const [deletingMultipleParticipants, setDeletingMultipleParticipants] = useState<Participant[] | null>(null);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Real-time synchronization pulse indicator
  const [isLiveSyncPulse, setIsLiveSyncPulse] = useState(false);
  const participantsCountRef = useRef(participants.length);
  participantsCountRef.current = participants.length;

  const addNotification = useCallback((notif: Omit<ToastNotification, 'id' | 'timestamp'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newEntry: ToastNotification = { ...notif, id, timestamp };

    // Stack up to 5 notifications at a time
    setNotifications((prev) => [newEntry, ...prev].slice(0, 5));

    // Auto-dismiss in exactly 5 seconds (5000ms)
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Helper for generic toast alerts
  const showToast = useCallback((text: string, type: 'success' | 'info' | 'delete' | 'error' = 'success') => {
    addNotification({
      title: type === 'error' ? 'Aviso del Sistema' : type === 'delete' ? 'Registro Eliminado' : 'Notificación',
      description: text,
      type,
    });
  }, [addNotification]);

  // Load participants directly from database
  const loadData = useCallback(async (isSilent = false) => {
    if (!isSilent) {
      setIsLoading(true);
    }
    setIsLiveSyncPulse(true);
    setTimeout(() => setIsLiveSyncPulse(false), 500);

    const { isConfigured } = getSupabaseCredentials();
    setDbStatus((prev) => ({ ...prev, isConfigured }));

    const res = await fetchParticipantsFromSupabase();

    if (res.error) {
      setDbError(res.error.message);
      if (!isSilent) {
        showToast(res.error.message, 'error');
      }
    } else {
      setDbError(null);
      const data = res.data || [];
      setParticipants(data);
      if (res.tableUsed) {
        setDbStatus({ isConfigured: true, table: res.tableUsed });
      }

      if (isSilent && data.length > participantsCountRef.current && participantsCountRef.current > 0) {
        const diff = data.length - participantsCountRef.current;
        const newest = data[0];
        if (newest) {
          addNotification({
            title: '¡Sincronización en Vivo!',
            description: `${diff} nuevo(s) miembro(s) sincronizado(s) en tiempo real`,
            user: newest.correo,
            category: newest.categoria,
            place: newest.lugar_representa,
            type: 'new_member',
          });
        } else {
          showToast(`¡${diff} nuevo(s) registro(s) sincronizado(s) en tiempo real!`, 'info');
        }
      }
    }

    if (!isSilent) {
      setIsLoading(false);
    }
  }, [showToast, addNotification]);

  // Initial load and Realtime Supabase subscription
  useEffect(() => {
    loadData(false);

    // Subscribe to Postgres Changes via Supabase Realtime channel
    const unsubscribe = subscribeToSupabaseParticipants(() => {
      loadData(true);
    });

    // 2-second background sync interval as fallback
    const intervalId = setInterval(() => {
      loadData(true);
    }, 2000);

    return () => {
      unsubscribe();
      clearInterval(intervalId);
    };
  }, [loadData]);

  // Handle browser popstate
  useEffect(() => {
    const handleLocationChange = () => {
      const pathname = window.location.pathname;
      const hash = window.location.hash;
      if (pathname.includes('/panel') || hash.includes('panel')) {
        setCurrentPath('/panel');
      } else {
        setCurrentPath('/');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateTo = (path: '/' | '/panel') => {
    setCurrentPath(path);
    try {
      const url = path === '/panel' ? '/panel' : '/';
      window.history.pushState({}, '', url);
    } catch {
      window.location.hash = path === '/panel' ? 'panel' : '';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenRegister = (category: ClubCategory) => {
    setModalCategory(category);
    setIsRegisterModalOpen(true);
  };

  const handleRegisterParticipant = async (data: ParticipantFormData) => {
    const res = await insertParticipantToSupabase(data);
    if (res.error) {
      showToast(res.error.message, 'error');
      return { success: false, error: res.error.message };
    }

    if (res.data) {
      const newParticipant = res.data;
      setParticipants((prev) => [newParticipant, ...prev.filter((p) => p.id !== newParticipant.id)]);
      
      // Show rich floating stacked notification on the right
      addNotification({
        title: '¡Nuevo Registro Oficial!',
        description: `${newParticipant.nombre} ${newParticipant.apellido}`,
        user: newParticipant.correo,
        category: newParticipant.categoria,
        place: newParticipant.lugar_representa,
        type: 'new_member',
      });

      return { success: true };
    }
  };

  const handleSaveEdit = async (updated: Participant) => {
    const res = await updateParticipantInSupabase(updated.id, updated);
    if (res.error) {
      showToast(res.error.message, 'error');
      return { success: false, error: res.error.message };
    }

    if (res.data) {
      setParticipants((prev) => prev.map((p) => (p.id === updated.id ? res.data! : p)));
      addNotification({
        title: 'Registro Actualizado',
        description: `Datos de ${updated.nombre} ${updated.apellido} guardados correctamente`,
        type: 'info',
      });
      return { success: true };
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingParticipant) return;
    const fullName = `${deletingParticipant.nombre} ${deletingParticipant.apellido}`;
    const idToDelete = deletingParticipant.id;
    
    const res = await deleteParticipantFromSupabase(idToDelete);
    if (res.error) {
      showToast(res.error.message, 'error');
    } else {
      setParticipants((prev) => prev.filter((p) => p.id !== idToDelete));
      setDeletingParticipant(null);
      addNotification({
        title: 'Participante Eliminado',
        description: `${fullName} eliminado de la base de datos`,
        type: 'delete',
      });
    }
  };

  const handleConfirmDeleteMultiple = async () => {
    if (!deletingMultipleParticipants || deletingMultipleParticipants.length === 0) return;
    const count = deletingMultipleParticipants.length;
    const idsToDelete = deletingMultipleParticipants.map((p) => p.id);
    const idSet = new Set(idsToDelete);

    const res = await deleteMultipleParticipantsFromSupabase(idsToDelete);
    if (res.error) {
      showToast(res.error.message, 'error');
    } else {
      setParticipants((prev) => prev.filter((p) => !idSet.has(p.id)));
      setDeletingMultipleParticipants(null);
      addNotification({
        title: 'Registros Eliminados',
        description: `${count} participantes eliminados de la base de datos`,
        type: 'delete',
      });
    }
  };

  const getCategoryBadge = (cat: ClubCategory) => {
    switch (cat) {
      case 'aventureros':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-300">
            <Sparkles className="w-3 h-3 text-sky-600" />
            <span>Aventureros</span>
          </span>
        );
      case 'conquistadores':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <Compass className="w-3 h-3 text-blue-600" />
            <span>Conquistadores</span>
          </span>
        );
      case 'guias_mayores':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-300">
            <ShieldCheck className="w-3 h-3 text-indigo-600" />
            <span>Guías Mayores</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-blue-600 selection:text-white font-sans antialiased relative">
      
      {/* Subtle Background Pattern */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-30 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem]"
      />

      {/* Discrete Floating Navigation in Top Right */}
      <div className="fixed top-4 right-4 z-40 flex items-center space-x-2">
        {currentPath === '/' ? (
          ''
        ) : (
          <button
            onClick={() => navigateTo('/')}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Inicio</span>
          </button>
        )}
      </div>

      {/* Floating Notifications Stack on the Right (Animated, Auto 5s, Stackable, with 'X' Close Button) */}
      <div 
        aria-live="polite"
        className="fixed top-16 right-4 sm:right-6 z-50 flex flex-col items-end space-y-2.5 max-w-sm sm:max-w-md w-full pointer-events-none"
      >
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`pointer-events-auto w-full p-4 rounded-2xl border shadow-xl backdrop-blur-md transition-all duration-300 transform animate-in slide-in-from-right-10 fade-in ${
              notif.type === 'error'
                ? 'bg-rose-50/95 border-rose-300 text-rose-950 shadow-rose-950/10'
                : notif.type === 'delete'
                ? 'bg-amber-50/95 border-amber-300 text-amber-950 shadow-amber-950/10'
                : notif.type === 'new_member'
                ? 'bg-gradient-to-r from-emerald-50/95 to-teal-50/95 border-emerald-300 text-emerald-950 shadow-emerald-950/10 ring-1 ring-emerald-400/30'
                : notif.type === 'info'
                ? 'bg-blue-50/95 border-blue-300 text-blue-950 shadow-blue-950/10'
                : 'bg-emerald-50/95 border-emerald-300 text-emerald-950 shadow-emerald-950/10'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start space-x-3 flex-1 min-w-0">
                <div className="mt-0.5 shrink-0">
                  {notif.type === 'error' ? (
                    <AlertCircle className="w-5 h-5 text-rose-600" />
                  ) : notif.type === 'delete' ? (
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                  ) : notif.type === 'new_member' ? (
                    <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                      <UserCheck className="w-4 h-4" />
                    </div>
                  ) : notif.type === 'info' ? (
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 flex-wrap mb-0.5">
                    <span className="text-xs font-black tracking-tight">{notif.title}</span>
                    {notif.category && getCategoryBadge(notif.category)}
                  </div>
                  
                  {notif.description && (
                    <p className="text-xs font-bold text-slate-800 leading-snug">{notif.description}</p>
                  )}
                  
                  {(notif.user || notif.place) && (
                    <div className="flex items-center space-x-2 text-[11px] text-slate-600 mt-1 font-mono flex-wrap gap-y-1">
                      {notif.user && (
                        <span className="bg-white/90 px-1.5 py-0.5 rounded-md border border-slate-200 text-blue-700 font-bold">
                          {notif.user}
                        </span>
                      )}
                      {notif.place && (
                        <span className="truncate text-slate-500 font-sans">
                          • {notif.place}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 font-sans">
                        • {notif.timestamp}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Close Button 'X' */}
              <button
                onClick={() => dismissNotification(notif.id)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-black/5 transition-colors cursor-pointer shrink-0"
                title="Cerrar notificación"
                aria-label="Cerrar notificación"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col justify-center relative z-10">
        
        {/* ROUTE 1: INDEX ('/') - Background with subtle overlay and single 'Registrarme' button */}
        {currentPath === '/' && (
          <HeroIndex
            onOpenRegister={() => handleOpenRegister('aventureros')}
          />
        )}

        {/* ROUTE 2: PANEL ('/panel') - Administrative Directory */}
        {currentPath === '/panel' && (
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-300">
            
            {/* Header for Panel */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <div className="flex items-center space-x-2.5 flex-wrap gap-y-2">
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                    Panel de Control y Registros
                  </h1>
                  
                  {/* Realtime Supabase Status Badge */}
                  <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className={`w-2 h-2 rounded-full bg-emerald-500 ${isLiveSyncPulse ? 'scale-125 ring-4 ring-emerald-200' : ''} transition-all duration-300`}></span>
                    <span>Realtime</span>
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Base de datos oficial • {isLoading ? 'Cargando registros...' : `${participants.length} miembros registrados`}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => loadData(false)}
                  disabled={isLoading}
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                  title="Recargar desde la base de datos"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${isLoading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Sincronizar</span>
                </button>

                <button
                  onClick={() => setIsExportModalOpen(true)}
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Exportar Excel</span>
                </button>
              </div>
            </div>

            {/* Error Banner if DB table is missing or connection failed */}
            {dbError && (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start justify-between gap-3 text-amber-900">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold">Aviso de Conexión con la Base de Datos</h4>
                    <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">{dbError}</p>
                    <p className="text-[11px] text-amber-700 mt-1">
                      Si aún no has creado la tabla en tu base de datos, puedes hacer clic en el botón <strong>"Estructura SQL"</strong> arriba y ejecutar el script en tu gestor de base de datos.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSupabaseModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shrink-0 cursor-pointer shadow-xs"
                >
                  Ver Script SQL
                </button>
              </div>
            )}

            {/* Stats Overview */}
            <StatsOverview
              participants={participants}
              selectedCategory={selectedTableCategory}
              onSelectCategory={setSelectedTableCategory}
            />

            {/* Participants Table & Cards View */}
            {isLoading ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
                <h3 className="text-sm font-bold text-slate-700">Cargando participantes...</h3>
                <p className="text-xs text-slate-400">Consultando la tabla oficial de la base de datos</p>
              </div>
            ) : participants.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">0 Registros en la Base de Datos</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                    La base de datos está lista y conectada. Haz clic en registrar para añadir el primer participante oficial.
                  </p>
                </div>
                <button
                  onClick={() => handleOpenRegister('aventureros')}
                  className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Registrar Primer Participante</span>
                </button>
              </div>
            ) : (
              <ParticipantsTable
                participants={participants}
                selectedCategory={selectedTableCategory}
                onSelectCategory={setSelectedTableCategory}
                onEditParticipant={(p) => setEditingParticipant(p)}
                onDeleteParticipant={(p) => setDeletingParticipant(p)}
                onDeleteMultiple={(items) => setDeletingMultipleParticipants(items)}
                onNavigateToRegister={() => handleOpenRegister('aventureros')}
              />
            )}

            <DevCredit whatsappNumber="584122974011" email="codezardi@gmail.com" dark/>
          </div>
        )}

      </main>

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        initialCategory={modalCategory}
        onRegister={handleRegisterParticipant}
      />

      {/* Edit Modal */}
      <EditParticipantModal
        participant={editingParticipant}
        isOpen={Boolean(editingParticipant)}
        onClose={() => setEditingParticipant(null)}
        onSave={handleSaveEdit}
      />

      {/* Single Delete Confirmation Modal */}
      <DeleteConfirmModal
        participant={deletingParticipant}
        isOpen={Boolean(deletingParticipant)}
        onClose={() => setDeletingParticipant(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Batch Delete Confirmation Modal */}
      <DeleteConfirmModal
        participantsList={deletingMultipleParticipants || []}
        isOpen={Boolean(deletingMultipleParticipants && deletingMultipleParticipants.length > 0)}
        onClose={() => setDeletingMultipleParticipants(null)}
        onConfirm={handleConfirmDeleteMultiple}
      />

      {/* Database Schema Modal */}
      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />

      {/* Excel Export Modal */}
      <ExportExcelModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        participants={participants}
      />

    </div>
  );
}
