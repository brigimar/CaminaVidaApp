'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { WizardProvider } from './wizard-context';
import { Loader2 } from 'lucide-react';

export default function WizardWrapper({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [hasSession, setHasSession] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) {
                    router.push('/login');
                } else {
                    setHasSession(true);
                }
            } catch (error) {
                console.error('Error checking session:', error);
                router.push('/login');
            } finally {
                setIsLoading(false);
            }
        };

        checkSession();
    }, [router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
                    <p className="text-slate-500 font-medium animate-pulse">Validando sesión...</p>
                </div>
            </div>
        );
    }

    if (!hasSession) return null;

    return (
        <WizardProvider>
            <div className="min-h-screen bg-white selection:bg-green-100">
                {children}
            </div>
        </WizardProvider>
    );
}
