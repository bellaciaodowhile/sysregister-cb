import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  UserPlus,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ClubCategory, ParticipantFormData } from '../types';
import { CATEGORIES_LIST } from '../data/categoryConfig';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: ClubCategory;
  onRegister: (data: ParticipantFormData) => Promise<{ success: boolean; error?: string } | void> | void;
}

// Capitalize all words in a string (e.g. "JUAN CARLOS" -> "Juan Carlos", "club albatros" -> "Club Albatros")
export const capitalizeText = (text: string): string => {
  if (!text) return '';
  return text
    .trim()
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((word) =>
      word.replace(/(^|[-_./•(])(\p{L})/gu, (_, prefix, letter) => `${prefix}${letter.toUpperCase()}`)
    )
    .join(' ');
};

export const generateUsernameFromEmail = (correo: string): string => {
  if (!correo.trim()) return '';
  const localPart = correo.trim().toLowerCase().split('@')[0];
  const cleanEmail = localPart.replace(/[^a-z0-9._-]/g, '') || 'miembro';
  return correo.trim();
};

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  initialCategory = 'aventureros',
  onRegister,
}) => {
  const [categoria, setCategoria] = useState<ClubCategory>(initialCategory);
  
  useEffect(() => {
    if (initialCategory) {
      setCategoria(initialCategory);
    }
  }, [initialCategory, isOpen]);

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [lugarRepresenta, setLugarRepresenta] = useState('');
  const [correo, setCorreo] = useState('');

  const [lastRegistered, setLastRegistered] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!nombre.trim()) newErrors.nombre = 'El nombre es obligatorio.';
    if (!apellido.trim()) newErrors.apellido = 'El apellido es obligatorio.';
    if (!lugarRepresenta.trim()) newErrors.lugar_representa = 'Indica el Club, Iglesia o Distrito.';
    
    if (!correo.trim()) {
      newErrors.correo = 'El correo electrónico es obligatorio.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) {
      newErrors.correo = 'Correo electrónico inválido.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    // Capitalize fields (excluding email)
    const formattedNombre = capitalizeText(nombre);
    const formattedApellido = capitalizeText(apellido);
    const formattedLugar = capitalizeText(lugarRepresenta);
    const formattedCorreo = correo.trim().toLowerCase();

    const registeredFullName = `${formattedNombre} ${formattedApellido}`;

    // Generated password is universally 123456789 for all participants
    const generatedPassword = '123456789';
    // Auto-generate compact username using format @[correo]26
    const finalUsername = generateUsernameFromEmail(formattedCorreo);

    const payload: ParticipantFormData = {
      usuario: finalUsername,
      nombre: formattedNombre,
      apellido: formattedApellido,
      lugar_representa: formattedLugar,
      correo: formattedCorreo,
      contrasena: generatedPassword,
      categoria: categoria,
    };

    try {
      const result = await onRegister(payload);
      if (result && result.success === false) {
        setErrors({ form: result.error || 'Error al registrar en la base de datos' });
        setIsSubmitting(false);
        return;
      }

      try {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }

      // Save last registered for clean inline feedback
      setLastRegistered(registeredFullName);

      // Reset and clean form for next participant
      setNombre('');
      setApellido('');
      setLugarRepresenta('');
      setCorreo('');
      setErrors({});
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al registrar en la base de datos';
      setErrors({ form: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryNames: Record<ClubCategory, string> = {
    aventureros: 'Aventureros',
    conquistadores: 'Conquistadores',
    guias_mayores: 'Guías Mayores',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="registration-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md"
        >
          {/* Modal Container with Instant Spring Pop Animation */}
          <motion.div
            key="registration-modal-card"
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ 
              type: 'spring', 
              damping: 25, 
              stiffness: 400,
              mass: 0.6
            }}
            className="relative bg-white border border-blue-200/80 rounded-3xl shadow-[0_25px_60px_-15px_rgba(15,23,42,0.5)] max-w-lg w-full overflow-hidden"
          >
            
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 px-6 py-4 text-white flex items-center justify-between shadow-xs">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center text-white">
                  <UserPlus className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-blue-200 uppercase tracking-wider block">
                    Registro de Participante
                  </span>
                  <h3 className="text-xl font-bold tracking-tight text-white leading-tight">
                    {categoryNames[categoria]}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => {
                  setLastRegistered(null);
                  onClose();
                }}
                className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Selector Tabs */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center justify-center gap-2">
              {CATEGORIES_LIST.map((catKey) => {
                const isSelected = categoria === catKey;
                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => {
                      setCategoria(catKey);
                    }}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer text-center ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs scale-[1.02]'
                        : 'bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300'
                    }`}
                  >
                    {categoryNames[catKey]}
                  </button>
                );
              })}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              {/* Database or Form Error Alert */}
              {errors.form && (
                <div className="flex items-center space-x-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium animate-in fade-in">
                  <span className="shrink-0 font-bold">⚠️</span>
                  <span>{errors.form}</span>
                </div>
              )}

              {/* Success Notification Alert after registering */}
              {lastRegistered && (
                <div className="flex items-center space-x-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>¡<strong>{lastRegistered}</strong> registrado con éxito! Formulario listo para el siguiente.</span>
                </div>
              )}

              {/* Nombre & Apellido */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Nombre</label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="ej. Juan"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all"
                  />
                  {errors.nombre && <p className="text-[11px] text-rose-500 font-medium">{errors.nombre}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Apellido</label>
                  <input
                    type="text"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    placeholder="ej. Pérez"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all"
                  />
                  {errors.apellido && <p className="text-[11px] text-rose-500 font-medium">{errors.apellido}</p>}
                </div>
              </div>

              {/* Lugar que representa */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Lugar que Representa</label>
                <input
                  type="text"
                  value={lugarRepresenta}
                  onChange={(e) => setLugarRepresenta(e.target.value)}
                  placeholder="ej. Club Albatros • Iglesia Central"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all"
                />
                {errors.lugar_representa && <p className="text-[11px] text-rose-500 font-medium">{errors.lugar_representa}</p>}
              </div>

              {/* Correo Electrónico */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Correo Electrónico</label>
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all"
                />
                {errors.correo && <p className="text-[11px] text-rose-500 font-medium">{errors.correo}</p>}
              </div>

              {/* Submit Action */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Registrar Participante</span>
                </button>
              </div>

            </form>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
