// Categorías disponibles
export type ClubCategory = 'aventureros' | 'conquistadores' | 'guias_mayores';

export interface Participant {
  id: string;
  usuario: string;             // 1. Usuario
  nombre: string;              // 2. Nombre
  apellido: string;            // 3. Apellido
  lugar_representa: string;    // 4. Lugar que representa (Club / Distrito / Iglesia)
  correo: string;              // 5. Correo
  contrasena: string;          // 6. Contraseña
  categoria: ClubCategory;
  created_at: string;
  avatar_seed?: string;
  nivel?: number;
  rango?: string;
}

export type ParticipantFormData = Omit<Participant, 'id' | 'created_at'>;

export interface CategoryMeta {
  id: ClubCategory;
  name: string;
  shortName: string;
  description: string;
  ageRange: string;
  color: {
    primary: string;
    border: string;
    bg: string;
    glow: string;
    badge: string;
    text: string;
    accent: string;
  };
  motto: string;
  iconName: string;
}
