'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { AvailabilityFormData } from './types';

/**
 * Hook para persistir disponibilidad horaria en coordinator_availability
 * Requerimiento: Step 5 → useSaveAvailabilityData → coordinator_availability
 */
export function useSaveAvailabilityData(coordinatorId: string) {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [initialData, setInitialData] = useState<Partial<AvailabilityFormData> | null>(null);

    useEffect(() => {
        const fetchInitial = async () => {
            if (!coordinatorId) {
                setFetching(false);
                return;
            }
            setFetching(true);
            try {
                const { data, error } = await supabase
                    .from('coordinator_availability')
                    .select('availability_json')
                    .eq('coordinator_id', coordinatorId)
                    .maybeSingle();

                if (data && data.availability_json) {
                    setInitialData({
                        slots: data.availability_json.slots || []
                    });
                }
            } catch (err) {
                console.error('Error fetching initial availability data:', err);
            } finally {
                setFetching(false);
            }
        };

        fetchInitial();
    }, [coordinatorId]);

    const save = async (data: AvailabilityFormData) => {
        setLoading(true);
        setSuccess(false);
        setError(null);

        // 1. Obtener sesión real
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
                .from('coordinator_availability')
                .select('id')
                .limit(1);

            if (connError) throw new Error(`Error de conexión: ${connError.message}`);

            // 3. Limpiar disponibilidad previa
            await supabase
                .from('coordinator_availability')
                .delete()
                .eq('coordinator_id', effectiveId);

            // 4. Insertar nueva disponibilidad JSON
            const { error: insertError } = await supabase
                .from('coordinator_availability')
                .insert({
                    coordinator_id: effectiveId,
                    availability_json: { slots: data.slots }
                });

            if (insertError) throw insertError;

            setSuccess(true);
            return { success: true };
        } catch (err: any) {
            const msg = err.message || 'Error al guardar disponibilidad horaria';
            setError(msg);
            return { success: false, error: msg };
        } finally {
            setLoading(false);
        }
    };

    return { save, loading, fetching, success, error, initialData };
}
