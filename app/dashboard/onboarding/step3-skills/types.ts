export interface SkillRating {
    skill_name: string;
    rating: number; // 1-5
    comment?: string; // opcional, max 200
}

export interface SkillsFormData {
    experience_years: string;
    motivation: string;
    skills: SkillRating[];
}

export const PREDEFINED_SKILLS = [
    'Liderazgo de grupos',
    'Primeros auxilios',
    'Conocimiento botánico',
    'Orientación y mapas',
    'Gestión de emergencias',
    'Comunicación asertiva',
    'Fotografía de naturaleza',
    'Idiomas'
];
