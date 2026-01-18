'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { PersonalFormData } from './types';

/**
 * Hook para persistir datos personales en coordinadores_bio
 * Requerimiento: Step 1 → useSavePersonalData → coordinator_personal (Mapeado a coordinadores_bio)
 */
export function useSavePersonalData(coordinatorId: string) {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [initialData, setInitialData] = useState<Partial<PersonalFormData> | null>(null);

    useEffect(() => {
        const fetchInitial = async () => {
            if (!coordinatorId) {
                setFetching(false);
                return;
            }
            setFetching(true);
            try {
                const { data, error } = await supabase
                    .from('coordinadores_bio')
                    .select('nombre, apellido, dni, fecha_nacimiento, genero')
                    .eq('id', coordinatorId)
                    .maybeSingle();

                if (data) {
                    setInitialData({
                        nombre: data.nombre || '',
                        apellido: data.apellido || '',
                        dni: data.dni || '',
                        fecha_nacimiento: data.fecha_nacimiento || '',
                        genero: (data.genero as any) || ''
                    });
                }
            } catch (err) {
                console.error('Error fetching initial personal data:', err);
            } finally {
                setFetching(false);
            }
        };

        fetchInitial();
    }, [coordinatorId]);

    const save = async (data: PersonalFormData) => {
        setLoading(true);
        setSuccess(false);
        setError(null);

        // 1. Obtener sesión real para operaciones seguras
        const { data: { user } } = await supabase.auth.getUser();
        const effectiveId = user?.id || coordinatorId;

        if (!effectiveId || effectiveId.length < 36) {
            const msg = 'Sesión no iniciada o ID de coordinador inválido';
            setError(msg);
            setLoading(false);
            return { success: false, error: msg };
        }

        try {
            // 2. Test de conexión
            const { error: connError } = await supabase
                .from('coordinadores_bio')
                .select('id')
                .limit(1);

            if (connError) throw new Error(`Error de conexión: ${connError.message}`);

            // 3. Upsert de datos con campos obligatorios (NOT NULL)
            const userEmail = user?.email;
            const { error: upsertError } = await supabase
                .from('coordinadores_bio')
                .upsert({
                    id: effectiveId,
                    nombre: data.nombre,
                    apellido: data.apellido,
                    dni: data.dni,
                    fecha_nacimiento: data.fecha_nacimiento,
                    genero: data.genero,
                    email: userEmail,
                    // Inicializar campos obligatorios para evitar error NOT NULL en primer registro
                    tiempo_acompanando: '',
                    motivacion_json: { selected: '' }
                }, { onConflict: 'id' });

            if (upsertError) throw upsertError;

            setSuccess(true);
            return { success: true };
        } catch (err: any) {
            const msg = err.message || 'Error al guardar datos personales';
            setError(msg);
            return { success: false, error: msg };
        } finally {
            setLoading(false);
        }
    };

    return { save, loading, fetching, success, error, initialData };
}
