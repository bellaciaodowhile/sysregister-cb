import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Sparkles, 
  Compass, 
  ShieldCheck, 
  User, 
  Mail, 
  Lock, 
  Building, 
  Eye, 
  EyeOff, 
  Edit3,
  AlertCircle
} from 'lucide-react';
import { Participant, ClubCategory } from '../types';
import { CATEGORY_CONFIGS, CATEGORIES_LIST } from '../data/categoryConfig';
import { capitalizeText } from './RegistrationModal';

interface EditParticipantModalProps {
  participant: Participant | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Participant) => Promise<{ success: boolean; error?: string } | void> | void;
}

export const EditParticipantModal: React.FC<EditParticipantModalProps> = ({
  participant,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Participant | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (participant) {
      setFormData({ ...participant });
      setErrors({});
    }
  }, [participant]);

  if (!isOpen || !formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => prev ? ({ ...prev, [name]: value }) : null);

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleCategorySelect = (category: ClubCategory) => {
    setFormData((prev) => prev ? ({ ...prev, categoria: category }) : null);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.usuario.trim()) newErrors.usuario = 'El usuario es obligatorio.';
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio.';
    if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es obligatorio.';
    if (!formData.lugar_representa.trim()) newErrors.lugar_representa = 'El lugar que representa es obligatorio.';
    if (!formData.correo.trim()) newErrors.correo = 'El correo es obligatorio.';
    if (!formData.contrasena) newErrors.contrasena = 'La contraseña es obligatoria.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    
    setIsSaving(true);
    const updatedPayload: Participant = {
      ...formData,
      nombre: capitalizeText(formData.nombre),
      apellido: capitalizeText(formData.apellido),
      lugar_representa: capitalizeText(formData.lugar_representa),
      correo: formData.correo.trim().toLowerCase(),
    };

    try {
      const result = await onSave(updatedPayload);
      if (result && result.success === false) {
        setErrors({ form: result.error || 'Error al actualizar en la base de datos' });
        setIsSaving(false);
        return;
      }
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar cambios';
      setErrors({ form: msg });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-white/10 text-white">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">Editar Participante</h3>
              <p className="text-xs text-blue-100 font-mono">@{formData.usuario}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Switcher in Edit */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 font-mono">Categoría:</span>
          <div className="flex items-center space-x-1.5">
            {CATEGORIES_LIST.map((catKey) => {
              const isSelected = formData.categoria === catKey;
              const config = CATEGORY_CONFIGS[catKey];
              return (
                <button
                  key={catKey}
                  type="button"
                  onClick={() => handleCategorySelect(catKey)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:text-blue-600'
                  }`}
                >
                  {config.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Form / DB Error banner */}
          {errors.form && (
            <div className="flex items-center space-x-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errors.form}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Usuario */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 uppercase">1. Usuario</label>
              <input
                type="text"
                name="usuario"
                value={formData.usuario}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600"
              />
              {errors.usuario && <p className="text-xs text-rose-500">{errors.usuario}</p>}
            </div>

            {/* Nombre */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">2. Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600"
              />
              {errors.nombre && <p className="text-xs text-rose-500">{errors.nombre}</p>}
            </div>

            {/* Apellido */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">3. Apellido</label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600"
              />
              {errors.apellido && <p className="text-xs text-rose-500">{errors.apellido}</p>}
            </div>

            {/* Lugar que representa */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 uppercase">4. Lugar que Representa</label>
              <input
                type="text"
                name="lugar_representa"
                value={formData.lugar_representa}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600"
              />
              {errors.lugar_representa && <p className="text-xs text-rose-500">{errors.lugar_representa}</p>}
            </div>

            {/* Correo */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">5. Correo</label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600"
              />
              {errors.correo && <p className="text-xs text-rose-500">{errors.correo}</p>}
            </div>

            {/* Contraseña */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">6. Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="contrasena"
                  value={formData.contrasena}
                  onChange={handleChange}
                  className="w-full pl-3.5 pr-10 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              {errors.contrasena && <p className="text-xs text-rose-500">{errors.contrasena}</p>}
            </div>

          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center space-x-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
