-- ==============================================================================
-- SISTEMA DE REGISTRO OFICIAL - CLUBES Y GUÍAS MAYORES
-- SCRIPT SQL PARA SUPABASE TABLE EDITOR / POSTGRESQL SQL EDITOR
-- ==============================================================================
-- Instrucciones de uso en Supabase:
-- 1. Ve a tu proyecto en Supabase (https://supabase.com/dashboard)
-- 2. En el menú lateral izquierdo, haz clic en "SQL Editor"
-- 3. Crea una nueva consulta ("New query")
-- 4. Pega todo el contenido de este archivo y presiona "RUN"
-- 5. Ve a "Table Editor" para visualizar y gestionar los registros en tiempo real.
-- ==============================================================================

-- 1. Habilitar extensión para generación de UUIDs (por defecto en Supabase)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Crear tabla oficial de participantes
CREATE TABLE IF NOT EXISTS public.participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario TEXT UNIQUE NOT NULL,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    lugar_representa TEXT NOT NULL,
    correo TEXT NOT NULL,
    contrasena TEXT NOT NULL DEFAULT '123456789',
    categoria TEXT NOT NULL CHECK (categoria IN ('aventureros', 'conquistadores', 'guias_mayores')),
    nivel INTEGER DEFAULT 1,
    rango TEXT,
    avatar_seed TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 3. Comentarios de documentación en columnas
COMMENT ON TABLE public.participants IS 'Registro oficial de miembros para Aventureros, Conquistadores y Guías Mayores.';
COMMENT ON COLUMN public.participants.usuario IS 'Nombre de usuario único generado con formato @[categoría]_[correo]2026.';
COMMENT ON COLUMN public.participants.nombre IS 'Nombre(s) del participante con formato Capitalize.';
COMMENT ON COLUMN public.participants.apellido IS 'Apellido(s) del participante con formato Capitalize.';
COMMENT ON COLUMN public.participants.lugar_representa IS 'Club, Iglesia o Distrito que representa el participante.';
COMMENT ON COLUMN public.participants.correo IS 'Correo electrónico en minúsculas para contacto y credenciales.';
COMMENT ON COLUMN public.participants.contrasena IS 'Contraseña universal estandarizada (123456789).';
COMMENT ON COLUMN public.participants.categoria IS 'División del club: aventureros (6-9 años), conquistadores (10-15 años), guias_mayores (16+ años).';

-- 4. Creación de Índices para optimizar búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_participants_categoria ON public.participants (categoria);
CREATE INDEX IF NOT EXISTS idx_participants_usuario ON public.participants (usuario);
CREATE INDEX IF NOT EXISTS idx_participants_correo ON public.participants (correo);
CREATE INDEX IF NOT EXISTS idx_participants_lugar ON public.participants (lugar_representa);
CREATE INDEX IF NOT EXISTS idx_participants_created_at ON public.participants (created_at DESC);

-- 5. Configuración de Seguridad de Nivel de Fila (Row Level Security - RLS)
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;

-- Política de Lectura Pública/Autenticada (Permite consultar el directorio)
CREATE POLICY "Permitir lectura publica de participantes"
    ON public.participants
    FOR SELECT
    USING (true);

-- Política de Inserción Pública/Autenticada (Permite auto-registro desde el portal)
CREATE POLICY "Permitir registro de nuevos participantes"
    ON public.participants
    FOR INSERT
    WITH CHECK (true);

-- Política de Actualización
CREATE POLICY "Permitir actualizacion de registros"
    ON public.participants
    FOR UPDATE
    USING (true);

-- Política de Eliminación
CREATE POLICY "Permitir eliminacion de registros"
    ON public.participants
    FOR DELETE
    USING (true);

-- 6. Habilitar Publicación en Tiempo Real (Supabase Realtime)
-- Esto permite que Supabase transmita eventos INSERT/UPDATE/DELETE en vivo a la app
ALTER PUBLICATION supabase_realtime ADD TABLE public.participants;

-- ==============================================================================
-- 7. REGISTROS INICIALES (DATOS DE EJEMPLO - TODOS CON CONTRASEÑA '123456789')
-- ==============================================================================

INSERT INTO public.participants (usuario, nombre, apellido, lugar_representa, correo, contrasena, categoria, nivel, rango, avatar_seed, created_at)
VALUES
-- AVENTUREROS (6 a 9 años)
('lucas_castor', 'Lucas', 'Fernández', 'Club Orión Central', 'lucas.fernandez@adventistas.org', '123456789', 'aventureros', 3, 'Abeja Laboriosa', 'Lucas', '2026-08-15T14:22:00Z'),
('sofia_estrella', 'Sofía', 'Mendoza', 'Club Rayos de Luz', 'sofia.mendoza@clubrayos.net', '123456789', 'aventureros', 4, 'Constructor', 'Sofia', '2026-08-18T10:15:00Z'),
('mateo_valiente', 'Mateo', 'Gutiérrez', 'Distrito Metropolitano Sur', 'mateo.gutierrez@gmail.com', '123456789', 'aventureros', 2, 'Rayito de Sol', 'Mateo', '2026-08-20T16:40:00Z'),
('valentina_p', 'Valentina', 'Paredes', 'Club Centinelas Norte', 'valen.paredes@adventistas.cl', '123456789', 'aventureros', 4, 'Manos Ayudadoras', 'Valentina', '2026-08-24T09:05:00Z'),
('samuel_castor', 'Samuel', 'Navarro', 'Club Betel', 'samuel.navarro@outlook.com', '123456789', 'aventureros', 1, 'Castorcito', 'Samuel', '2026-08-28T11:30:00Z'),

-- CONQUISTADORES (10 a 15 años)
('diego_halcon', 'Diego', 'Alvarado', 'Club Halcones del Valle', 'diego.alvarado@halcones.club', '123456789', 'conquistadores', 6, 'Guía de Excursionismo', 'Diego', '2026-08-10T12:00:00Z'),
('camila_cordillera', 'Camila', 'Rojas', 'Club Pleyades Cordillera', 'camila.rojas@pleyades.org', '123456789', 'conquistadores', 5, 'Viajero Explorador', 'Camila', '2026-08-12T18:25:00Z'),
('joaquin_senda', 'Joaquín', 'Silva', 'Club Leones de Judá', 'joaquin.silva@gmail.com', '123456789', 'conquistadores', 6, 'Pionero Aventajado', 'Joaquin', '2026-08-16T15:10:00Z'),
('isabella_mar', 'Isabella', 'Castro', 'Club Albatros Marítimo', 'isabella.castro@albatros.org', '123456789', 'conquistadores', 5, 'Orientador Alfa', 'Isabella', '2026-08-22T08:45:00Z'),
('gabriel_puma', 'Gabriel', 'Torres', 'Club Centinelas Norte', 'gabriel.torres@centinelas.cl', '123456789', 'conquistadores', 4, 'Amigo de Campamento', 'Gabriel', '2026-08-27T19:30:00Z'),
('daniela_brújula', 'Daniela', 'Herrera', 'Club Alfa & Omega', 'dani.herrera@alfaomega.club', '123456789', 'conquistadores', 6, 'Guía de Campo', 'Daniela', '2026-08-29T14:15:00Z'),

-- GUÍAS MAYORES (16+ años)
('rodrigo_master', 'Rodrigo', 'Vargas', 'Misión Central - Directiva', 'rodrigo.vargas@adventistas.org', '123456789', 'guias_mayores', 10, 'Guía Mayor Máster Avanzado', 'Rodrigo', '2026-08-05T08:00:00Z'),
('elena_instructora', 'Elena', 'Morales', 'Club Orión Central', 'elena.morales@gmail.com', '123456789', 'guias_mayores', 9, 'Instructora de Supervivencia', 'Elena', '2026-08-07T11:40:00Z'),
('carlos_coordinador', 'Carlos', 'Soto', 'Distrito Los Andes', 'carlos.soto@andes.org', '123456789', 'guias_mayores', 8, 'Guía Mayor de Área', 'Carlos', '2026-08-14T17:50:00Z'),
('mariana_lider', 'Mariana', 'Fuentes', 'Club Halcones del Valle', 'mariana.fuentes@halcones.club', '123456789', 'guias_mayores', 9, 'Consejera Mayor', 'Mariana', '2026-08-19T13:20:00Z'),
('felipe_instructor', 'Felipe', 'Espinoza', 'Club Leones de Judá', 'felipe.espinoza@gmail.com', '123456789', 'guias_mayores', 8, 'Instructor Primeros Auxilios', 'Felipe', '2026-08-25T16:00:00Z')
ON CONFLICT (usuario) DO NOTHING;
