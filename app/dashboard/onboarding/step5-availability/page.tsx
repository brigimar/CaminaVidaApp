'use client';

import { useRouter } from 'next/navigation';
import { AvailabilityForm } from './form';
import { useSaveAvailabilityData } from './hooks';
import { useWizard } from '../wizard-context';
import { Loader2, Sparkles, ChevronLeft, AlertCircle } from 'lucide-react';

export default function Step5Availability() {
    const router = useRouter();
    const { updateStepData, state, prevStep, resetWizard } = useWizard();
    // ID dinámico desde el contexto (Auth o Fallback UUID)
    const { loading, fetching, initialData, save, error } = useSaveAvailabilityData(state.coordinatorId || '');

    const handleNext = async (data: any) => {
        const result = await save(data);
        if (result.success) {
            // Bridge: { slots: { day, slot }[] } -> Record<string, string[]>
            const availabilityRecord: Record<string, string[]> = {};
            data.slots.forEach((s: any) => {
                if (!availabilityRecord[s.day]) availabilityRecord[s.day] = [];
                availabilityRecord[s.day].push(s.slot);
            });

            updateStepData(5, availabilityRecord);

            console.log("Onboarding Completo! Estado Final:", {
                ...state,
                availabilityData: availabilityRecord
            });

            alert("¡Onboarding completado con éxito! Recopilando datos finales...");
            resetWizard();
        }
    };

    const handleBack = () => {
        prevStep();
    };

    if (fetching) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-12 h-12 text-[#4CAF50] animate-spin" />
            </div>
        );
    }

    // Bridge: Record -> Array para el formulario
    const formDefaults = Object.keys(state.availabilityData).length > 0
        ? {
            slots: Object.entries(state.availabilityData).flatMap(([day, slots]) =>
                slots.map(slot => ({ day, slot }))
            )
        }
        : initialData;

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-start pt-20 pb-40 px-6 overflow-x-hidden">
            {/* Background blur effects */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-green-50 rounded-full blur-3xl opacity-40" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-coral-50 rounded-full blur-3xl opacity-30" />
            </div>

            <div className="relative z-10 w-full max-w-xl">
                <header className="mb-16 space-y-4">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-slate-400 hover:text-[#4CAF50] transition-colors mb-8 group"
                    >
                        <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        Atrás
                    </button>
                    <div className="flex items-center gap-2 text-[#4CAF50] font-bold uppercase tracking-widest text-sm">
                        <Sparkles className="w-4 h-4" />
                        Paso 5 de 5
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 leading-tight">
                        Tu tiempo es <span className="text-[#4CAF50] italic">oro...</span>
                    </h1>
                    {error && (
                        <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 animate-in fade-in slide-in-from-top-4">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}
                </header>

                <AvailabilityForm
                    onSubmit={handleNext}
                    isLoading={loading}
                    defaultValues={formDefaults || {}}
                />
            </div>
        </div>
    );
}
