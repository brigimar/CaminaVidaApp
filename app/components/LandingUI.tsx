'use client';

import Link from 'next/link';

export default function LandingUI() {
    return (
        <div className="relative min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-green-200 rounded-full blur-3xl opacity-20 animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-coral-200 rounded-full blur-3xl opacity-20" />
            </div>

            <main className="relative z-10 text-center space-y-8 max-w-2xl">
                <div className="space-y-4">
                    <h1 className="text-6xl font-black tracking-tight text-slate-900 sm:text-7xl">
                        Camina <span className="text-green-600">Vida</span> <span className="text-coral-500">4.0</span>
                    </h1>
                    <p className="text-xl text-slate-600 font-medium">
                        Plataforma integral de auditoría socio-económica y onboarding para coordinadores.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                        href="/dashboard"
                        className="group relative px-8 py-4 bg-green-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-green-200 hover:bg-green-700 hover:scale-105 transition-all active:scale-95"
                    >
                        Acceder al Dashboard
                    </Link>
                    <Link
                        href="/dashboard/onboarding/step1-personal"
                        className="px-8 py-4 bg-white text-slate-700 border-2 border-slate-200 rounded-2xl font-bold text-lg hover:border-coral-400 hover:text-coral-500 transition-all"
                    >
                        Registro de Coordinadores
                    </Link>
                </div>

                <div className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
                    <div className="p-6 bg-white/50 backdrop-blur-sm rounded-3xl border border-white/20">
                        <div className="text-green-600 font-bold mb-2">Integridad</div>
                        <p className="text-sm text-slate-500">Auditoría en tiempo real con Fuente de Verdad Global.</p>
                    </div>
                    <div className="p-6 bg-white/50 backdrop-blur-sm rounded-3xl border border-white/20">
                        <div className="text-coral-500 font-bold mb-2">Eficiencia</div>
                        <p className="text-sm text-slate-500">Onboarding automatizado con scoring predictivo.</p>
                    </div>
                    <div className="p-6 bg-white/50 backdrop-blur-sm rounded-3xl border border-white/20">
                        <div className="text-blue-500 font-bold mb-2">Seguridad</div>
                        <p className="text-sm text-slate-500">Trazabilidad absoluta de eventos económicos.</p>
                    </div>
                </div>
            </main>

            <footer className="absolute bottom-8 text-slate-400 text-sm">
                &copy; 2026 Camina Vida 4.0 — Sistema Socio-Económico Auditado
            </footer>

            <style jsx>{`
                .text-coral-500 { color: #ff6f61; }
                .bg-coral-200 { background-color: #ffd8d6; }
                .hover\:border-coral-400:hover { border-color: #ff9b91; }
                .hover\:text-coral-500:hover { color: #ff6f61; }
            `}</style>
        </div>
    );
}
