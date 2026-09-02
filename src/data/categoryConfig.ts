import { CategoryMeta, ClubCategory } from '../types';

export interface CategoryCardDetail extends CategoryMeta {
  subtitle: string;
  tagline: string;
  badgeLabel: string;
  accentBg: string;
  cardGradient: string;
  iconBg: string;
  keyFeatures: string[];
  backgroundImage: string;
}

export const CATEGORIES_LIST: ClubCategory[] = ['aventureros', 'conquistadores', 'guias_mayores'];

export const CATEGORY_CONFIGS: Record<string, CategoryCardDetail> = {
  aventureros: {
    id: 'aventureros',
    name: 'Aventureros',
    shortName: 'Aventureros',
    subtitle: 'Exploración, Valores y Naturaleza',
    tagline: 'Por amor a Jesús, haré siempre lo mejor',
    description: 'Para niños y niñas de 6 a 9 años. Amistad, naturaleza y valores cristianos.',
    ageRange: '6 - 9 años',
    badgeLabel: '1° Categoría',
    accentBg: 'bg-sky-50 text-sky-700 border-sky-200',
    cardGradient: 'from-sky-900/90 via-sky-800/80 to-slate-900/90',
    iconBg: 'bg-sky-500/20 text-sky-300 border-sky-400/30',
    keyFeatures: ['Especialidades básicas', 'Campamentos familiares', 'Estudio de la naturaleza'],
    backgroundImage: 'https://images.unsplash.com/photo-1476231682828-37e571bc172f?q=80&w=1200&auto=format&fit=crop',
    color: {
      primary: '#0284c7', // Sky 600
      border: 'border-sky-200 hover:border-sky-400',
      bg: 'bg-sky-50',
      glow: 'shadow-[0_8px_30px_rgba(2,132,199,0.12)]',
      badge: 'bg-sky-100 text-sky-800 border-sky-200',
      text: 'text-sky-700',
      accent: 'from-sky-500 to-blue-600',
    },
    motto: 'Por amor a Jesús, haré siempre lo mejor',
    iconName: 'Sparkles',
  },
  conquistadores: {
    id: 'conquistadores',
    name: 'Conquistadores',
    shortName: 'Conquistadores',
    subtitle: 'Aventura, Campismo y Servicio',
    tagline: 'Puro, bondadoso y leal • El mensaje del Advenimiento',
    description: 'Para jóvenes de 10 a 15 años. Liderazgo juvenil, campismo y compañerismo.',
    ageRange: '10 - 15 años',
    badgeLabel: '2° Categoría',
    accentBg: 'bg-blue-50 text-blue-700 border-blue-200',
    cardGradient: 'from-blue-950/90 via-blue-900/80 to-slate-900/90',
    iconBg: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
    keyFeatures: ['Campismo & Supervivencia', 'Marchas y Disciplina', 'Especialidades avanzadas'],
    backgroundImage: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=1200&auto=format&fit=crop',
    color: {
      primary: '#2563eb', // Blue 600
      border: 'border-blue-200 hover:border-blue-400',
      bg: 'bg-blue-50',
      glow: 'shadow-[0_8px_30px_rgba(37,99,235,0.12)]',
      badge: 'bg-blue-100 text-blue-800 border-blue-200',
      text: 'text-blue-700',
      accent: 'from-blue-600 to-indigo-600',
    },
    motto: 'El amor de Cristo me motiva',
    iconName: 'Compass',
  },
  guias_mayores: {
    id: 'guias_mayores',
    name: 'Guías Mayores',
    shortName: 'Guías Mayores',
    subtitle: 'Liderazgo, Mentoría y Rescate',
    tagline: 'Guiar a los jóvenes en el camino de la salvación y el servicio',
    description: 'Para líderes de 16+ años. Formación de líderes, rescate y docencia.',
    ageRange: '16+ años',
    badgeLabel: '3° Categoría',
    accentBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    cardGradient: 'from-indigo-950/90 via-indigo-900/80 to-slate-900/90',
    iconBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30',
    keyFeatures: ['Liderazgo Eclesiástico', 'Técnicas de Rescate', 'Instrucción de Especialidades'],
    backgroundImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop',
    color: {
      primary: '#4338ca', // Indigo 700
      border: 'border-indigo-200 hover:border-indigo-400',
      bg: 'bg-indigo-50',
      glow: 'shadow-[0_8px_30px_rgba(67,56,202,0.12)]',
      badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      text: 'text-indigo-700',
      accent: 'from-indigo-600 to-blue-700',
    },
    motto: 'Liderazgo con propósito y excelencia',
    iconName: 'ShieldCheck',
  },
};

