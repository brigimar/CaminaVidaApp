'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import RegisterForm from './RegisterForm';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showRegister, setShowRegister] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setLoading(false);

        if (loginError) {
            setError(loginError.message);
        } else {
            router.push('/dashboard/onboarding/step1');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-2xl font-bold mb-6">Camina Vida</h1>

            {!showRegister ? (
                <>
                    <form onSubmit={handleLogin} className="flex flex-col w-full max-w-sm gap-4">
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="p-2 border rounded"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="p-2 border rounded"
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-green-500 text-white py-2 rounded disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : 'Ingresar'}
                        </button>
                        {error && <p className="text-red-500">{error}</p>}
                    </form>

                    <p className="mt-4 text-center">
                        ¿No tienes cuenta?{' '}
                        <button
                            className="text-green-500 underline"
                            onClick={() => setShowRegister(true)}
                        >
                            Regístrate
                        </button>
                    </p>
                </>
            ) : (
                <>
                    <RegisterForm />
                    <p className="mt-4 text-center">
                        ¿Ya tienes cuenta?{' '}
                        <button
                            className="text-green-500 underline"
                            onClick={() => setShowRegister(false)}
                        >
                            Inicia sesión
                        </button>
                    </p>
                </>
            )}
        </div>
    );
}
