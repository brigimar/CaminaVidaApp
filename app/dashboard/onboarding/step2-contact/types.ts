export interface ContactFormData {
    email: string;
    telefono?: string;
    direccion?: string;
    zonas: string[];
}

export const AVAILABLE_ZONES = [
    'Palermo',
    'Recoleta',
    'Belgrano',
    'Caballito',
    'Villa Urquiza',
    'Almagro',
    'Colegiales',
    'Nuñez',
    'San Telmo',
    'Puerto Madero'
];
