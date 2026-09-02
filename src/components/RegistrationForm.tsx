import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  User, 
  Mail, 
  Lock, 
  MapPin, 
  Sparkles, 
  Compass, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  KeyRound, 
  CheckCircle2, 
  Shield,
  Building,
  AlertCircle,
  RefreshCw,
  UserPlus,
  ArrowRight
} from 'lucide-react';
import { ClubCategory, ParticipantFormData } from '../types';
import { CATEGORY_CONFIGS, CATEGORIES_LIST } from '../data/categoryConfig';
import { sound } from '../lib/soundEffects';

interface RegistrationFormProps {
  onRegister: (data: ParticipantFormData) => void;
  onCancel?: () => void;
  initialCategory?: ClubCategory;
  onCategoryChange?: (category: ClubCategory) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onRegister,
  onCancel,
  initialCategory = 'aventureros',
  onCategoryChange,
}) => {
  const [categoria, setCategoria] = useState<ClubCategory>(initialCategory);
  
  // Sync when initialCategory prop changes from external slider
  useEffect(() => {
    setCategoria(initialCategory);
  }, [initialCategory]);

  const [usuario, setUsuario] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [lugarRepresenta, setLugarRepresenta] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState<string | null>(null);

  const currentCategoryConfig = CATEGORY_CONFIGS[categoria] || CATEGORY_CONFIGS.aventureros;

  // Generate strong random password
  const generateRandomPassword = () => {
    sound.playClick();
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$*';
    let result = '';
    for (let i = 0; i < 10; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setContrasena(result);
    setShowPassword(true);
    if (errors.contrasena) {
      setErrors((prev) => ({ ...prev, contrasena: '' }));
    }
  };

  // Auto-suggest username from name and surname
  const suggestUsername = () => {
    if (!nombre.trim()) return;
    const cleanName = nombre.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanSurname = apellido.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const randNum = Math.floor(10 + Math.random() * 90);
    const suggested = cleanSurname ? `${cleanName}_${cleanSurname}` : `${cleanName}${randNum}`;
    setUsuario(suggested);
    if (errors.usuario) {
      setErrors((prev) => ({ ...prev, usuario: '' }));
    }
  };

  const handleCategorySelect = (cat: ClubCategory) => {
    sound.playClick();
    setCategoria(cat);
    if (onCategoryChange) {
      onCategoryChange(cat);
    }
  };

  // Validate form
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // 1. Usuario
    if (!usuario.trim()) {
      newErrors.usuario = 'El nombre de usuario es obligatorio.';
    } else if (usuario.trim().length < 3) {
      newErrors.usuario = 'Debe tener al menos 3 caracteres.';
    } else if (!/^[a-zA-Z0-9._-]+$/.test(usuario.trim())) {
      newErrors.usuario = 'Solo letras, números, puntos, guiones y guión bajo.';
    }

    // 2. Nombre
    if (!nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio.';
    } else if (nombre.trim().length < 2) {
      newErrors.nombre = 'Ingrese un nombre válido.';
    }

    // 3. Apellido
    if (!apellido.trim()) {
      newErrors.apellido = 'El apellido es obligatorio.';
    } else if (apellido.trim().length < 2) {
      newErrors.apellido = 'Ingrese un apellido válido.';
    }

    // 4. Lugar que representa
    if (!lugarRepresenta.trim()) {
      newErrors.lugar_representa = 'Indique el Club, Distrito o Iglesia que representa.';
    }

    // 5. Correo
    if (!correo.trim()) {
      newErrors.correo = 'El correo electrónico es obligatorio.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) {
      newErrors.correo = 'Ingrese un correo electrónico con formato válido.';
    }

    // 6. Contraseña
    if (!contrasena) {
      newErrors.contrasena = 'La contraseña es obligatoria.';
    } else if (contrasena.length < 6) {
      newErrors.contrasena = 'La contraseña debe tener al menos 6 caracteres.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      sound.playError();
      return;
    }

    setIsSubmitting(true);
    sound.playSuccess();

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#2563eb', '#0284c7', '#4338ca', '#38bdf8']
      });
    } catch {
      // ignore
    }

    const data: ParticipantFormData = {
      categoria,
      usuario: usuario.trim().toLowerCase().replace(/^@/, ''),
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      lugar_representa: lugarRepresenta.trim(),
      correo: correo.trim().toLowerCase(),
      contrasena,
      rango: categoria === 'guias_mayores' ? 'Guía Mayor Máster' : categoria === 'conquistadores' ? 'Capitán' : 'Explorador',
      nivel: categoria === 'guias_mayores' ? 8 : categoria === 'conquistadores' ? 5 : 2,
    };

    setTimeout(() => {
      onRegister(data);
      setIsSubmitting(false);
      setRegisteredSuccess(data.usuario);
      
      // Reset form
      setUsuario('');
      setNombre('');
      setApellido('');
      setLugarRepresenta('');
      setCorreo('');
      setContrasena('');
    }, 400);
  };

  return (
    <div id="registration-form-container" className="w-full max-w-4xl mx-auto">
      
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xl shadow-blue-500/5 overflow-hidden transition-all">
        
        {/* Card Header in Blue & White Minimalist Theme */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 px-6 sm:px-8 py-6 sm:py-7 text-white relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="px-3 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-mono font-bold tracking-wider uppercase backdrop-blur-xs">
                  {currentCategoryConfig.badgeLabel}
                </span>
                <span className="text-blue-100 text-xs font-semibold">
                  {currentCategoryConfig.ageRange}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                Registro Oficial de Inscripción
              </h2>
              <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-xl">
                Completa los 6 datos solicitados para ingresar al participante en el registro oficial.
              </p>
            </div>

            {/* Category Emblem */}
            <div className="hidden sm:flex items-center space-x-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20">
              <div className="p-2 rounded-xl bg-white text-blue-700 shadow-sm">
                {categoria === 'aventureros' && <Sparkles className="w-5 h-5" />}
                {categoria === 'conquistadores' && <Compass className="w-5 h-5" />}
                {categoria === 'guias_mayores' && <ShieldCheck className="w-5 h-5" />}
              </div>
              <div>
                <div className="text-[10px] text-blue-200 uppercase font-mono font-bold">Categoría Activa</div>
                <div className="text-sm font-bold text-white">{currentCategoryConfig.name}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Fast Switcher Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
            Categoría del Participante:
          </span>

          <div className="flex items-center space-x-2">
            {CATEGORIES_LIST.map((catKey) => {
              const isSelected = categoria === catKey;
              const config = CATEGORY_CONFIGS[catKey];

              return (
                <button
                  key={catKey}
                  type="button"
                  onClick={() => handleCategorySelect(catKey)}
                  className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                      : 'bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300'
                  }`}
                >
                  {catKey === 'aventureros' && <Sparkles className="w-3.5 h-3.5" />}
                  {catKey === 'conquistadores' && <Compass className="w-3.5 h-3.5" />}
                  {catKey === 'guias_mayores' && <ShieldCheck className="w-3.5 h-3.5" />}
                  <span>{config.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Success Alert Banner if just registered */}
        {registeredSuccess && (
          <div className="mx-6 sm:mx-8 mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="text-xs sm:text-sm">
                <strong>¡Inscripción Exitosa!</strong> El participante <code className="font-bold bg-emerald-100 px-1.5 py-0.5 rounded">@{registeredSuccess}</code> ha sido registrado. Puedes registrar otro participante o consultar el panel general en <code>/panel</code>.
              </div>
            </div>
            <button
              onClick={() => setRegisteredSuccess(null)}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-bold px-2 py-1 cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        )}

        {/* Form Body with 6 Required Fields */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* 1. Usuario */}
            <div className="space-y-1.5 md:col-span-2">
              <div className="flex items-center justify-between">
                <label htmlFor="reg-usuario" className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span>1. Nombre de Usuario (Username) <span className="text-rose-500">*</span></span>
                </label>
                <button
                  type="button"
                  onClick={suggestUsername}
                  className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold normal-case flex items-center space-x-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Auto-sugerir desde Nombre</span>
                </button>
              </div>

              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-mono text-sm font-bold pointer-events-none">
                  @
                </span>
                <input
                  id="reg-usuario"
                  type="text"
                  value={usuario}
                  onChange={(e) => {
                    setUsuario(e.target.value);
                    if (errors.usuario) setErrors((prev) => ({ ...prev, usuario: '' }));
                  }}
                  placeholder="ej. carlos_mendez"
                  className={`w-full pl-8 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all font-mono ${
                    errors.usuario
                      ? 'border-rose-400 focus:ring-rose-200'
                      : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100'
                  }`}
                />
              </div>
              {errors.usuario && (
                <p className="text-xs text-rose-600 flex items-center space-x-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.usuario}</span>
                </p>
              )}
            </div>

            {/* 2. Nombre */}
            <div className="space-y-1.5">
              <label htmlFor="reg-nombre" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                <span>2. Nombre <span className="text-rose-500">*</span></span>
              </label>
              <input
                id="reg-nombre"
                type="text"
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                  if (errors.nombre) setErrors((prev) => ({ ...prev, nombre: '' }));
                }}
                placeholder="ej. Daniel"
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.nombre
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100'
                }`}
              />
              {errors.nombre && (
                <p className="text-xs text-rose-600 flex items-center space-x-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.nombre}</span>
                </p>
              )}
            </div>

            {/* 3. Apellido */}
            <div className="space-y-1.5">
              <label htmlFor="reg-apellido" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                <span>3. Apellido <span className="text-rose-500">*</span></span>
              </label>
              <input
                id="reg-apellido"
                type="text"
                value={apellido}
                onChange={(e) => {
                  setApellido(e.target.value);
                  if (errors.apellido) setErrors((prev) => ({ ...prev, apellido: '' }));
                }}
                placeholder="ej. Alvarado"
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.apellido
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100'
                }`}
              />
              {errors.apellido && (
                <p className="text-xs text-rose-600 flex items-center space-x-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.apellido}</span>
                </p>
              )}
            </div>

            {/* 4. Lugar que representa */}
            <div className="space-y-1.5 md:col-span-2">
              <label htmlFor="reg-lugar" className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                <Building className="w-3.5 h-3.5 text-blue-600" />
                <span>4. Lugar que Representa (Club / Distrito / Iglesia) <span className="text-rose-500">*</span></span>
              </label>
              <input
                id="reg-lugar"
                type="text"
                value={lugarRepresenta}
                onChange={(e) => {
                  setLugarRepresenta(e.target.value);
                  if (errors.lugar_representa) setErrors((prev) => ({ ...prev, lugar_representa: '' }));
                }}
                placeholder="ej. Club Orión • Distrito Central • Iglesia Bethel"
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.lugar_representa
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100'
                }`}
              />
              {errors.lugar_representa && (
                <p className="text-xs text-rose-600 flex items-center space-x-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.lugar_representa}</span>
                </p>
              )}
            </div>

            {/* 5. Correo Electrónico */}
            <div className="space-y-1.5">
              <label htmlFor="reg-correo" className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-600" />
                <span>5. Correo Electrónico <span className="text-rose-500">*</span></span>
              </label>
              <input
                id="reg-correo"
                type="email"
                value={correo}
                onChange={(e) => {
                  setCorreo(e.target.value);
                  if (errors.correo) setErrors((prev) => ({ ...prev, correo: '' }));
                }}
                placeholder="ej. daniel.alvarado@ejemplo.com"
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all font-mono ${
                  errors.correo
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100'
                }`}
              />
              {errors.correo && (
                <p className="text-xs text-rose-600 flex items-center space-x-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.correo}</span>
                </p>
              )}
            </div>

            {/* 6. Contraseña */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="reg-contrasena" className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                  <Lock className="w-3.5 h-3.5 text-blue-600" />
                  <span>6. Contraseña <span className="text-rose-500">*</span></span>
                </label>
                <button
                  type="button"
                  onClick={generateRandomPassword}
                  className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold normal-case flex items-center space-x-1 cursor-pointer"
                >
                  <KeyRound className="w-3 h-3" />
                  <span>Generar Segura</span>
                </button>
              </div>

              <div className="relative">
                <input
                  id="reg-contrasena"
                  type={showPassword ? 'text' : 'password'}
                  value={contrasena}
                  onChange={(e) => {
                    setContrasena(e.target.value);
                    if (errors.contrasena) setErrors((prev) => ({ ...prev, contrasena: '' }));
                  }}
                  placeholder="Mínimo 6 caracteres"
                  className={`w-full pl-4 pr-11 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all font-mono ${
                    errors.contrasena
                      ? 'border-rose-400 focus:ring-rose-200'
                      : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.contrasena && (
                <p className="text-xs text-rose-600 flex items-center space-x-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.contrasena}</span>
                </p>
              )}
            </div>

          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <div className="text-xs text-slate-500 flex items-center space-x-2">
              <Shield className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Los registros se indexan automáticamente en el panel y en la exportación Excel</span>
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition-all cursor-pointer"
                >
                  Cancelar
                </button>
              )}

              <button
                type="submit"
                id="btn-submit-registration"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-7 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/25 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Guardando Registro...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Confirmar Registro Oficial</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </form>

      </div>

    </div>
  );
};
