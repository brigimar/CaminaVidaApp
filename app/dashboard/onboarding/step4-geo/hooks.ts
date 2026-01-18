'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { GeoFormData } from './types';

/**
 * Hook para persistir datos geográficos en coordinator_geo_availability
 * Requerimiento: Step 4 → useSaveGeoData → coordinator_geo (Mapeado a coordinator_geo_availability)
 */
export function useSaveGeoData(coordinatorId: string) {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [initialData, setInitialData] = useState<Partial<GeoFormData> | null>(null);

    useEffect(() => {
        const fetchInitial = async () => {
            if (!coordinatorId) {
                setFetching(false);
                return;
            }
            setFetching(true);
            try {
                const { data, error } = await supabase
                    .from('coordinator_geo_availability')
                    .select('zone')
                    .eq('coordinator_id', coordinatorId);

                if (data && data.length > 0) {
                    const localidades = data.map(item => ({
                        provincia: '',
                        localidad: item.zone
                    }));

                    setInitialData({
                        provincias: [],
                        localidades: localidades
                    });
                }
            } catch (err) {
                console.error('Error fetching initial geo data:', err);
            } finally {
                setFetching(false);
            }
        };

        fetchInitial();
    }, [coordinatorId]);

    const save = async (data: GeoFormData) => {
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
                .from('coordinator_geo_availability')
                .select('coordinator_id')
                .limit(1);

            if (connError) throw new Error(`Error de conexión: ${connError.message}`);

            // 3. Limpiar datos previos
            await supabase
                .from('coordinator_geo_availability')
                .delete()
                .eq('coordinator_id', effectiveId);

            // 4. Insertar nuevas zonas
            if (data.localidades.length > 0) {
                const { error: insertError } = await supabase
                    .from('coordinator_geo_availability')
                    .insert(data.localidades.map(l => ({
                        coordinator_id: effectiveId,
                        zone: l.localidad
                    })));

                if (insertError) throw insertError;
            }

            setSuccess(true);
            return { success: true };
        } catch (err: any) {
            const msg = err.message || 'Error al guardar datos geográficos';
            setError(msg);
            return { success: false, error: msg };
        } finally {
            setLoading(false);
        }
    };

    return { save, loading, fetching, success, error, initialData };
}
