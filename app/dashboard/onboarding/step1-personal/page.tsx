'use client';

import { useRouter } from 'next/navigation';
import { PersonalForm } from './form';
import { useSavePersonalData } from './hooks';
import { useWizard } from '../wizard-context';
import { Loader2, AlertCircle } from 'lucide-react';

export default function Step1Personal() {
    const router = useRouter();
    const { updateStepData, nextStep, state } = useWizard();
    // ID dinámico desde el contexto (Auth o Fallback UUID)
    const { loading, fetching, initialData, save, error } = useSavePersonalData(state.coordinatorId || '');

    const handleNext = async (data: any) => {
        const result = await save(data);
        if (result.success) {
            updateStepData(1, data);
            nextStep();
        }
    };

    if (fetching) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
            </div>
        );
    }

    // Normalizamos los datos antes de pasarlos a defaultValues
    const normalizedDefaultValues = (() => {
        const data = state.personalData.nombre ? state.personalData : initialData;
        if (!data) return undefined;

        return {
            ...data,
            genero: data.genero === '' ? undefined : data.genero,
        };
    })();

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-start pt-20 pb-40 px-6 overflow-x-hidden">
            {/* Background blur effects */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-green-50 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-[-10%] left-[-20%] w-[600px] h-[600px] bg-coral-50 rounded-full blur-3xl opacity-30" />
            </div>

            <div className="relative z-10 w-full max-w-xl">
                <header className="mb-16 space-y-4">
                    <div className="flex items-center gap-2 text-green-600 font-bold uppercase tracking-widest text-sm">
                        <span className="w-8 h-[2px] bg-green-600"></span>
                        Paso 1 de 5
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 leading-tight">
                        Cuentanos sobre <span className="text-green-600 italic">tí.</span>
                    </h1>
                    {error && (
                        <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 animate-in fade-in slide-in-from-top-4">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}
                </header>

                <PersonalForm
                    onSubmit={handleNext}
                    isLoading={loading}
                    defaultValues={normalizedDefaultValues}
                />
            </div>
        </div>
    );
}
