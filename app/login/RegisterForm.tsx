'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Loader2 } from 'lucide-react';

export default function RegisterForm() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
                },
            });

            if (signUpError) {
                setError(signUpError.message);
            } else if (data.user) {
                setSuccess(
                    'Usuario registrado correctamente. Revisa tu email para confirmar la cuenta.'
                );
            } else {
                setError('No se pudo registrar el usuario. Intenta nuevamente.');
            }
        } catch (err) {
            console.error(err);
            setError('Error inesperado al registrar usuario.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleRegister} className="flex flex-col w-full max-w-sm gap-4">
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
                {loading ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : 'Registrarse'}
            </button>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-600">{success}</p>}
        </form>
    );
}
