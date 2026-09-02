/**
 * Supabase Structure and Configuration
 * Provides SQL DDL, RLS policies, connection config and data mapping.
 */

export const SUPABASE_SQL_SCHEMA = `-- =========================================================================
-- SUPABASE / POSTGRESQL SCHEMA: REGISTRO DE PARTICIPANTES POR CATEGORÍAS
-- Categorías: Aventureros, Conquistadores, Guías Mayores
-- =========================================================================

-- 1. Crear ENUM para las 3 categorías
CREATE TYPE categoria_club AS ENUM ('aventureros', 'conquistadores', 'guias_mayores');

-- 2. Crear tabla principal con los campos requeridos en el orden exacto
CREATE TABLE IF NOT EXISTS public.participantes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Campos solicitados por el usuario:
    usuario VARCHAR(60) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    lugar_representa VARCHAR(150) NOT NULL,
    correo VARCHAR(255) NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    
    -- Categoría del club
    categoria categoria_club NOT NULL,
    
    -- Metadatos adicionales para gamificación y control
    nivel INT DEFAULT 1,
    rango VARCHAR(80),
    avatar_seed VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Crear índices de alto rendimiento para búsquedas y filtros por categoría
CREATE INDEX IF NOT EXISTS idx_participantes_categoria ON public.participantes(categoria);
CREATE INDEX IF NOT EXISTS idx_participantes_usuario ON public.participantes(usuario);
CREATE INDEX IF NOT EXISTS idx_participantes_correo ON public.participantes(correo);
CREATE INDEX IF NOT EXISTS idx_participantes_lugar ON public.participantes(lugar_representa);

-- 4. Habilitar Seguridad a Nivel de Fila (Row Level Security - RLS)
ALTER TABLE public.participantes ENABLE ROW LEVEL SECURITY;

-- Política de lectura pública / autenticada
CREATE POLICY "Permitir lectura de participantes a todos"
ON public.participantes FOR SELECT
USING (true);

-- Política de inserción pública (para formularios de registro abiertos)
CREATE POLICY "Permitir registro de nuevos participantes"
ON public.participantes FOR INSERT
WITH CHECK (true);

-- Política de actualización
CREATE POLICY "Permitir actualizar participantes"
ON public.participantes FOR UPDATE
USING (true);

-- Política de eliminación
CREATE POLICY "Permitir eliminar participantes"
ON public.participantes FOR DELETE
USING (true);

-- 5. Trigger para actualizar el timestamp en modificaciones
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_update_participantes_timestamp
BEFORE UPDATE ON public.participantes
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();
`;

export interface SupabaseConfigStatus {
  url: string;
  anonKey: string;
  isConfigured: boolean;
  mode: 'mock' | 'live';
}

export function getSupabaseConfig(): SupabaseConfigStatus {
  const env = (import.meta as unknown as { env?: Record<string, string> }).env || {};
  const url = env.VITE_SUPABASE_URL || '';
  const anonKey = env.VITE_SUPABASE_ANON_KEY || '';
  const isConfigured = Boolean(url && anonKey && url.startsWith('http'));
  
  return {
    url,
    anonKey,
    isConfigured,
    mode: isConfigured ? 'live' : 'mock',
  };
}
