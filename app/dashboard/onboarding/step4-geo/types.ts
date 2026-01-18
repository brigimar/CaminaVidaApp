export interface GeoFormData {
    provincias: string[];
    localidades: {
        provincia: string;
        localidad: string;
    }[];
}

export const DATOS_GEO: Record<string, string[]> = {
    "Buenos Aires": ["CABA", "La Plata", "Mar del Plata", "Bahía Blanca", "Tandil"],
    "Córdoba": ["Córdoba Capital", "Villa Carlos Paz", "Alta Gracia", "La Cumbre", "Capilla del Monte"],
    "Santa Fe": ["Rosario", "Santa Fe Capital", "Rafaela", "Venado Tuerto"],
    "Mendoza": ["Mendoza Capital", "San Rafael", "Malargüe", "Luján de Cuyo"],
    "Tucumán": ["San Miguel de Tucumán", "Yerba Buena", "Tafí Viejo"],
    "Salta": ["Salta Capital", "Cafayate", "San Lorenzo", "Cachi"],
    "Jujuy": ["San Salvador de Jujuy", "Tilcara", "Purmamarca", "Humahuaca"],
    "Chubut": ["Trelew", "Puerto Madryn", "Rawson", "Esquel"],
    "Neuquén": ["Neuquén Capital", "San Martín de los Andes", "Villa La Angostura"],
    "Río Negro": ["Bariloche", "Viedma", "San Antonio Oeste"],
    "Tierra del Fuego": ["Ushuaia", "Río Grande"],
    "Catamarca": ["San Fernando del Valle de Catamarca", "Belén"],
    "La Rioja": ["La Rioja Capital", "Chilecito"],
    "San Juan": ["San Juan Capital", "Valle Fértil"],
    "San Luis": ["San Luis Capital", "Merlo", "Villa de Merlo"],
    "Entre Ríos": ["Paraná", "Concordia", "Gualeguaychú"],
    "Corrientes": ["Corrientes Capital", "Goya"],
    "Misiones": ["Posadas", "Puerto Iguazú", "Oberá"],
    "Formosa": ["Formosa Capital", "Clorinda"],
    "Chaco": ["Resistencia", "Presidencia Roque Sáenz Peña"],
    "Santiago del Estero": ["Santiago del Estero Capital", "Termas de Río Hondo"],
    "La Pampa": ["Santa Rosa", "General Pico"],
    "Santa Cruz": ["Río Gallegos", "El Calafate", "Puerto Deseado"],
    "CABA": ["San Telmo", "Palermo", "Recoleta", "Belgrano", "Caballito"]
};
