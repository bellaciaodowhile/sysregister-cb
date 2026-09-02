-- ==============================================================================
-- SCHEMA SQL - TABLA PARTICIPANTS (SUPABASE / POSTGRESQL)
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

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

CREATE INDEX IF NOT EXISTS idx_participants_categoria ON public.participants (categoria);
CREATE INDEX IF NOT EXISTS idx_participants_usuario ON public.participants (usuario);
CREATE INDEX IF NOT EXISTS idx_participants_correo ON public.participants (correo);
CREATE INDEX IF NOT EXISTS idx_participants_created_at ON public.participants (created_at DESC);

ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir lectura publica de participantes"
    ON public.participants FOR SELECT USING (true);

CREATE POLICY "Permitir registro de nuevos participantes"
    ON public.participants FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir actualizacion de registros"
    ON public.participants FOR UPDATE USING (true);

CREATE POLICY "Permitir eliminacion de registros"
    ON public.participants FOR DELETE USING (true);

-- Semilla de datos con contraseña estandarizada '123456789'
INSERT INTO public.participants (usuario, nombre, apellido, lugar_representa, correo, contrasena, categoria, nivel, rango, avatar_seed, created_at)
VALUES
('lucas_castor', 'Lucas', 'Fernández', 'Club Orión Central', 'lucas.fernandez@adventistas.org', '123456789', 'aventureros', 3, 'Abeja Laboriosa', 'Lucas', '2026-08-15T14:22:00Z'),
('sofia_estrella', 'Sofía', 'Mendoza', 'Club Rayos de Luz', 'sofia.mendoza@clubrayos.net', '123456789', 'aventureros', 4, 'Constructor', 'Sofia', '2026-08-18T10:15:00Z'),
('mateo_valiente', 'Mateo', 'Gutiérrez', 'Distrito Metropolitano Sur', 'mateo.gutierrez@gmail.com', '123456789', 'aventureros', 2, 'Rayito de Sol', 'Mateo', '2026-08-20T16:40:00Z'),
('valentina_p', 'Valentina', 'Paredes', 'Club Centinelas Norte', 'valen.paredes@adventistas.cl', '123456789', 'aventureros', 4, 'Manos Ayudadoras', 'Valentina', '2026-08-24T09:05:00Z'),
('samuel_castor', 'Samuel', 'Navarro', 'Club Betel', 'samuel.navarro@outlook.com', '123456789', 'aventureros', 1, 'Castorcito', 'Samuel', '2026-08-28T11:30:00Z'),
('diego_halcon', 'Diego', 'Alvarado', 'Club Halcones del Valle', 'diego.alvarado@halcones.club', '123456789', 'conquistadores', 6, 'Guía de Excursionismo', 'Diego', '2026-08-10T12:00:00Z'),
('camila_cordillera', 'Camila', 'Rojas', 'Club Pleyades Cordillera', 'camila.rojas@pleyades.org', '123456789', 'conquistadores', 5, 'Viajero Explorador', 'Camila', '2026-08-12T18:25:00Z'),
('joaquin_senda', 'Joaquín', 'Silva', 'Club Leones de Judá', 'joaquin.silva@gmail.com', '123456789', 'conquistadores', 6, 'Pionero Aventajado', 'Joaquin', '2026-08-16T15:10:00Z'),
('isabella_mar', 'Isabella', 'Castro', 'Club Albatros Marítimo', 'isabella.castro@albatros.org', '123456789', 'conquistadores', 5, 'Orientador Alfa', 'Isabella', '2026-08-22T08:45:00Z'),
('gabriel_puma', 'Gabriel', 'Torres', 'Club Centinelas Norte', 'gabriel.torres@centinelas.cl', '123456789', 'conquistadores', 4, 'Amigo de Campamento', 'Gabriel', '2026-08-27T19:30:00Z'),
('daniela_brújula', 'Daniela', 'Herrera', 'Club Alfa & Omega', 'dani.herrera@alfaomega.club', '123456789', 'conquistadores', 6, 'Guía de Campo', 'Daniela', '2026-08-29T14:15:00Z'),
('rodrigo_master', 'Rodrigo', 'Vargas', 'Misión Central - Directiva', 'rodrigo.vargas@adventistas.org', '123456789', 'guias_mayores', 10, 'Guía Mayor Máster Avanzado', 'Rodrigo', '2026-08-05T08:00:00Z'),
('elena_instructora', 'Elena', 'Morales', 'Club Orión Central', 'elena.morales@gmail.com', '123456789', 'guias_mayores', 9, 'Instructora de Supervivencia', 'Elena', '2026-08-07T11:40:00Z'),
('carlos_coordinador', 'Carlos', 'Soto', 'Distrito Los Andes', 'carlos.soto@andes.org', '123456789', 'guias_mayores', 8, 'Guía Mayor de Área', 'Carlos', '2026-08-14T17:50:00Z'),
('mariana_lider', 'Mariana', 'Fuentes', 'Club Halcones del Valle', 'mariana.fuentes@halcones.club', '123456789', 'guias_mayores', 9, 'Consejera Mayor', 'Mariana', '2026-08-19T13:20:00Z'),
('felipe_instructor', 'Felipe', 'Espinoza', 'Club Leones de Judá', 'felipe.espinoza@gmail.com', '123456789', 'guias_mayores', 8, 'Instructor Primeros Auxilios', 'Felipe', '2026-08-25T16:00:00Z')
ON CONFLICT (usuario) DO NOTHING;
