import React, { useState } from 'react';
import { 
  Database, 
  Copy, 
  Check, 
  X, 
  ExternalLink, 
  Code2, 
  ShieldCheck, 
  Terminal,
  FileCode
} from 'lucide-react';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeSqlTab, setActiveSqlTab] = useState<'schema' | 'rls' | 'seed'>('schema');

  if (!isOpen) return null;

  const SCHEMA_SQL = `-- 1. Esquema oficial para tabla de Participantes (PostgreSQL)
create table public.participants (
  id uuid primary key default gen_random_uuid(),
  usuario text unique not null,
  nombre text not null,
  apellido text not null,
  lugar_representa text not null,
  correo text not null,
  contrasena text not null default '123456789',
  categoria text not null check (categoria in ('aventureros', 'conquistadores', 'guias_mayores')),
  created_at timestamp with time zone default now() not null
);

-- Índices de consulta rápida
create index idx_participants_category on public.participants(categoria);
create index idx_participants_user on public.participants(usuario);`;

  const RLS_SQL = `-- 2. Políticas de Seguridad RLS (Row Level Security)
alter table public.participants enable row level security;

-- Lectura pública para líderes autorizados
create policy "Allow read for authenticated staff"
on public.participants for select
using (true);

-- Registro abierto de nuevos miembros
create policy "Allow insert for public registration"
on public.participants for insert
with check (true);

-- Edición permitida para administradores
create policy "Allow update for admin role"
on public.participants for update
using (true);`;

  const SEED_SQL = `-- 3. Script de datos iniciales con contraseña 123456789
insert into public.participants (usuario, nombre, apellido, lugar_representa, correo, contrasena, categoria)
values
  ('samuelito_r', 'Samuel', 'Rojas', 'Club Orión • Distrito Central', 'samuel.rojas@gmail.com', '123456789', 'aventureros'),
  ('pionero_david', 'David', 'Mendoza', 'Club Albatros • Iglesia Central', 'david.mendoza@gmail.com', '123456789', 'conquistadores'),
  ('guia_elena', 'Elena', 'Vásquez', 'Club Bethel • Distrito Norte', 'elena.vasquez@gmail.com', '123456789', 'guias_mayores');`;

  const getActiveCode = () => {
    switch (activeSqlTab) {
      case 'schema':
        return SCHEMA_SQL;
      case 'rls':
        return RLS_SQL;
      case 'seed':
        return SEED_SQL;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-white/10 text-white">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">Esquema SQL de la Base de Datos</h3>
              <p className="text-xs text-blue-100">Scripts DDL PostgreSQL listos para producción</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setActiveSqlTab('schema')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSqlTab === 'schema'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-blue-600'
              }`}
            >
              1. Tabla & Índices
            </button>
            <button
              onClick={() => setActiveSqlTab('rls')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSqlTab === 'rls'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-blue-600'
              }`}
            >
              2. Políticas de Seguridad
            </button>
            <button
              onClick={() => setActiveSqlTab('seed')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSqlTab === 'seed'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-blue-600'
              }`}
            >
              3. Seed Data
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-bold transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? '¡Copiado al Portapapeles!' : 'Copiar SQL'}</span>
          </button>
        </div>

        {/* Code Content */}
        <div className="p-6">
          <pre className="bg-slate-900 text-slate-100 p-4 rounded-2xl text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
            <code>{getActiveCode()}</code>
          </pre>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <span>Puedes ejecutar este código directamente en el editor SQL de tu base de datos.</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
