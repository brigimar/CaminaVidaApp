'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { supabase } from '@/lib/supabaseClient';

/**
 * RUTAS DE NAVEGACIÓN
 */
const STEP_ROUTES = [
    '/dashboard/onboarding/step1-personal',
    '/dashboard/onboarding/step2-contact',
    '/dashboard/onboarding/step3-skills',
    '/dashboard/onboarding/step4-geo',
    '/dashboard/onboarding/step5-availability',
];

/**
 * INTERFACE WizardState completa
 */
export interface WizardState {
    coordinatorId: string | null;
    personalData: {
        nombre: string;
        apellido: string;
        dni: string;
        fecha_nacimiento: string;
        genero: 'Hombre' | 'Mujer' | 'Otro' | '';
    };
    contactData: {
        email: string;
        telefono: string;
        direccion: string;
        zonas: string[];
    };
    skillsData: {
        experiencia: string;
        motivacion: string;
        habilidades: { nombre: string; rating: number; comentario?: string }[];
    };
    geoData: {
        provincias: string[];
        localidades: Record<string, string[]>;
    };
    availabilityData: {
        [dia: string]: string[];
    };
    currentStep: number;
}

/**
 * MAPEADO DE PASOS A LLAVES DEL ESTADO
 */
const STEP_TO_KEY: Record<number, keyof Omit<WizardState, 'currentStep' | 'coordinatorId'>> = {
    1: 'personalData',
    2: 'contactData',
    3: 'skillsData',
    4: 'geoData',
    5: 'availabilityData',
};

type StepDataPayload =
    | Partial<WizardState['personalData']>
    | Partial<WizardState['contactData']>
    | Partial<WizardState['skillsData']>
    | Partial<WizardState['geoData']>
    | Partial<WizardState['availabilityData']>;

interface WizardContextType {
    state: WizardState;
    /**
     * updateStepData(step, data)
     * Ejemplo: updateStepData(1, { nombre: 'Juan' })
     */
    updateStepData: (step: number, data: any) => void;
    /**
     * Avanza a la siguiente ruta definida en STEP_ROUTES
     */
    nextStep: () => void;
    /**
     * Retrocede a la ruta anterior definida en STEP_ROUTES
     */
    prevStep: () => void;
    /**
     * Reinicia el estado a los valores iniciales y vuelve al paso 1
     */
    resetWizard: () => void;
}

const initialState: WizardState = {
    coordinatorId: null,
    personalData: { nombre: '', apellido: '', dni: '', fecha_nacimiento: '', genero: '' },
    contactData: { email: '', telefono: '', direccion: '', zonas: [] },
    skillsData: { experiencia: '', motivacion: '', habilidades: [] },
    geoData: { provincias: [], localidades: {} },
    availabilityData: {},
    currentStep: 1,
};

const WizardContext = createContext<WizardContextType | undefined>(undefined);

/**
 * WIZARD PROVIDER
 * Gestiona el estado compartido y la persistencia en memoria durante el onboarding.
 */
export function WizardProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<WizardState>(initialState);
    const router = useRouter();
    const pathname = usePathname();

    // Sincronizar currentStep automáticamente con la URL activa
    useEffect(() => {
        const index = STEP_ROUTES.findIndex(route => pathname.includes(route));
        if (index !== -1) {
            setState(prev => ({ ...prev, currentStep: index + 1 }));
        }
    }, [pathname]);

    // Obtener ID del coordinador autenticado
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data: { user }, error } = await supabase.auth.getUser();
                if (user) {
                    setState(prev => ({ ...prev, coordinatorId: user.id }));
                } else {
                    setState(prev => ({ ...prev, coordinatorId: null }));
                }
            } catch (err) {
                console.error('Error fetching user in wizard context:', err);
                setState(prev => ({ ...prev, coordinatorId: null }));
            }
        };
        fetchUser();

        // Escuchar cambios de autenticación
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setState(prev => ({ ...prev, coordinatorId: session.user.id }));
            } else {
                setState(prev => ({ ...prev, coordinatorId: null }));
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const nextStep = () => {
        if (!state.coordinatorId) {
            console.error('Navegación bloqueada: No hay sesión activa');
            router.push('/login');
            return;
        }
        if (state.currentStep < 5) {
            router.push(STEP_ROUTES[state.currentStep]);
        }
    };

    const prevStep = () => {
        if (state.currentStep > 1) {
            router.push(STEP_ROUTES[state.currentStep - 2]);
        }
    };

    const updateStepData = (step: number, data: any) => {
        const key = STEP_TO_KEY[step];
        if (key) {
            setState(prev => ({
                ...prev,
                [key]: { ...prev[key], ...data }
            }));
        }
    };

    const resetWizard = () => {
        setState(initialState);
        router.push(STEP_ROUTES[0]);
    };

    return (
        <WizardContext.Provider value={{ state, nextStep, prevStep, updateStepData, resetWizard }}>
            {children}
        </WizardContext.Provider>
    );
}

/**
 * HOOK useWizard
 * Permite acceder al estado y métodos del wizard desde cualquier Client Component.
 * 
 * Ejemplo de uso:
 * const { state, updateStepData, nextStep, prevStep } = useWizard();
 * 
 * const handleNext = (formData) => {
 *   updateStepData(1, formData);
 *   nextStep();
 * };
 */
export function useWizard() {
    const context = useContext(WizardContext);
    if (!context) {
        throw new Error('useWizard debe ser usado dentro de un WizardProvider');
    }
    return context;
}
