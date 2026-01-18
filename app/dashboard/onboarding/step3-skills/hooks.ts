'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { SkillsFormData } from './types';

/**
 * Hook para persistir datos de habilidades en coordinator_skills y bio
 * Requerimiento: Step 3 → useSaveSkillsData → coordinator_skills
 */
export function useSaveSkillsData(coordinatorId: string) {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [initialData, setInitialData] = useState<Partial<SkillsFormData> | null>(null);

    useEffect(() => {
        const fetchInitial = async () => {
            if (!coordinatorId) {
                setFetching(false);
                return;
            }
            setFetching(true);
            try {
                // Fetch Bio
                const { data: bio, error: bioError } = await supabase
                    .from('coordinadores_bio')
                    .select('tiempo_acompanando, motivacion_json')
                    .eq('id', coordinatorId)
                    .maybeSingle();

                // Fetch Skills
                const { data: skills, error: skillsError } = await supabase
                    .from('coordinator_skills')
                    .select('skill_name, rating')
                    .eq('coordinator_id', coordinatorId);

                if (bio || skills) {
                    setInitialData({
                        experience_years: bio?.tiempo_acompanando || '',
                        motivation: bio?.motivacion_json?.selected || '',
                        skills: skills?.map(s => ({
                            skill_name: s.skill_name,
                            rating: s.rating,
                            comment: '' // No existe en DB
                        })) || []
                    });
                }
            } catch (err) {
                console.error('Error fetching initial skills data:', err);
            } finally {
                setFetching(false);
            }
        };

        fetchInitial();
    }, [coordinatorId]);

    const save = async (data: SkillsFormData) => {
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
                .from('coordinator_skills')
                .select('id')
                .limit(1);

            if (connError) throw new Error(`Error de conexión: ${connError.message}`);

            // 3. Persistencia de Bio
            const { error: bioError } = await supabase
                .from('coordinadores_bio')
                .upsert({
                    id: effectiveId,
                    tiempo_acompanando: data.experience_years,
                    motivacion_json: { selected: data.motivation },
                    email: user?.email // Asegurar email en upsert
                }, { onConflict: 'id' });

            if (bioError) throw bioError;

            // 4. Persistencia de Skills (Delete + Insert para limpieza total)
            await supabase
                .from('coordinator_skills')
                .delete()
                .eq('coordinator_id', effectiveId);

            if (data.skills.length > 0) {
                const { error: skillsError } = await supabase
                    .from('coordinator_skills')
                    .insert(data.skills.map(s => ({
                        coordinator_id: effectiveId,
                        skill_name: s.skill_name,
                        rating: s.rating
                    })));

                if (skillsError) throw skillsError;
            }

            setSuccess(true);
            return { success: true };
        } catch (err: any) {
            const msg = err.message || 'Error al guardar habilidades';
            setError(msg);
            return { success: false, error: msg };
        } finally {
            setLoading(false);
        }
    };

    return { save, loading, fetching, success, error, initialData };
}
