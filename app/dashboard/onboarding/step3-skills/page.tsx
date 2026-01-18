'use client';

import { useRouter } from 'next/navigation';
import { SkillsForm } from './form';
import { useSaveSkillsData } from './hooks';
import { useWizard } from '../wizard-context';
import { Loader2, ChevronLeft, AlertCircle } from 'lucide-react';

export default function Step3Skills() {
    const router = useRouter();
    const { updateStepData, nextStep, prevStep, state } = useWizard();
    // ID dinámico desde el contexto (Auth o Fallback UUID)
    const { loading, fetching, initialData, save, error } = useSaveSkillsData(state.coordinatorId || '');

    const handleNext = async (data: any) => {
        const result = await save(data);
        if (result.success) {
            // Bridge: Form -> Context
            updateStepData(3, {
                experiencia: data.experience_years,
                motivacion: data.motivation,
                habilidades: data.skills.map((s: any) => ({
                    nombre: s.skill_name,
                    rating: s.rating,
                    comentario: s.comment
                }))
            });
            nextStep();
        }
    };

    const handleBack = () => {
        prevStep();
    };

    if (fetching) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
            </div>
        );
    }

    // Bridge: Context -> Form
    const formDefaults = state.skillsData.experiencia
        ? {
            experience_years: state.skillsData.experiencia,
            motivation: state.skillsData.motivacion,
            skills: state.skillsData.habilidades.map(h => ({
                skill_name: h.nombre,
                rating: h.rating,
                comment: h.comentario
            }))
        }
        : initialData;

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-start pt-20 pb-40 px-6 overflow-x-hidden">
            {/* Background blur effects */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-green-50 rounded-full blur-3xl opacity-50" />
                <div className="absolute top-[20%] left-[-20%] w-[500px] h-[500px] bg-coral-50 rounded-full blur-3xl opacity-20" />
            </div>

            <div className="relative z-10 w-full max-w-xl">
                <header className="mb-16 space-y-4">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-slate-400 hover:text-green-600 transition-colors mb-8 group"
                    >
                        <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        Atrás
                    </button>
                    <div className="flex items-center gap-2 text-green-600 font-bold uppercase tracking-widest text-sm">
                        <span className="w-8 h-[2px] bg-green-600"></span>
                        Paso 3 de 5
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 leading-tight">
                        Tus <span className="text-green-600 italic">superpoderes.</span>
                    </h1>
                    {error && (
                        <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 animate-in fade-in slide-in-from-top-4">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}
                </header>

                <SkillsForm
                    onSubmit={handleNext}
                    isLoading={loading}
                    defaultValues={formDefaults || {}}
                />
            </div>
        </div>
    );
}
