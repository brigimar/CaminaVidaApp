export interface AvailabilitySlot {
    day: string;
    slot: string;
}

export interface AvailabilityFormData {
    slots: AvailabilitySlot[];
}

export const DAYS_OF_WEEK = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
export const TIME_SLOTS = ["08:00-10:00", "10:00-12:00", "12:00-14:00", "14:00-16:00", "16:00-18:00", "18:00-20:00"];
