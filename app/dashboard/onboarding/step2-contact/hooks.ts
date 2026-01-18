'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { ContactFormData } from './types';

/**
 * Hook para persistir datos de contacto en coordinadores_bio
 * Requerimiento: Step 2 → useSaveContactData → (email, telefono, direccion)
 */
export function useSaveContactData(coordinatorId: string) {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [initialData, setInitialData] = useState<Partial<ContactFormData> | null>(null);

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
                    .select('email, telefono, direccion')
                    .eq('id', coordinatorId)
                    .maybeSingle();

                if (data) {
                    setInitialData({
                        email: data.email || '',
                        telefono: data.telefono || '',
                        direccion: data.direccion || ''
                    });
                }
            } catch (err) {
                console.error('Error fetching initial contact data:', err);
            } finally {
                setFetching(false);
            }
        };

        fetchInitial();
    }, [coordinatorId]);

    const save = async (data: ContactFormData) => {
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
                .from('coordinadores_bio')
                .select('id')
                .limit(1);

            if (connError) throw new Error(`Error de conexión: ${connError.message}`);

            // 3. Upsert de datos de contacto
            const { error: upsertError } = await supabase
                .from('coordinadores_bio')
                .upsert({
                    id: effectiveId,
                    email: data.email || user?.email, // Prefer email from form, fallback to session
                    telefono: data.telefono,
                    direccion: data.direccion
                }, { onConflict: 'id' });

            if (upsertError) throw upsertError;

            setSuccess(true);
            return { success: true };
        } catch (err: any) {
            const msg = err.message || 'Error al guardar datos de contacto';
            setError(msg);
            return { success: false, error: msg };
        } finally {
            setLoading(false);
        }
    };

    return { save, loading, fetching, success, error, initialData };
}
