'use client';

import { useEffect } from 'react';
import { Alert } from '../components/ui/Alert';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="p-4">
            <Alert
                title="Error del Sistema"
                description="Ocurrió un error al cargar los datos. Por favor intente nuevamente."
                severity="CRITICAL"
            />
            <button
                onClick={() => reset()}
                className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
            >
                Reintentar
            </button>
        </div>
    );
}
