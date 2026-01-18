'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Globe, Check, X, ArrowRight, Loader2, ChevronRight } from 'lucide-react';
import { GeoFormData, DATOS_GEO } from './types';

interface GeoFormProps {
    onSubmit: (data: GeoFormData) => void;
    isLoading?: boolean;
    defaultValues?: Partial<GeoFormData>;
}

export function GeoForm({ onSubmit, isLoading, defaultValues }: GeoFormProps) {
    const [selectedProvincias, setSelectedProvincias] = useState<string[]>(defaultValues?.provincias || []);
    const [selectedLocalidades, setSelectedLocalidades] = useState<{ provincia: string; localidad: string }[]>(defaultValues?.localidades || []);

    const toggleProvincia = (prov: string) => {
        setSelectedProvincias(prev =>
            prev.includes(prov) ? prev.filter(p => p !== prov) : [...prev, prov]
        );
    };

    const toggleLocalidad = (prov: string, loc: string) => {
        setSelectedLocalidades(prev => {
            const exists = prev.find(l => l.provincia === prov && l.localidad === loc);
            if (exists) {
                return prev.filter(l => !(l.provincia === prov && l.localidad === loc));
            } else {
                return [...prev, { provincia: prov, localidad: loc }];
            }
        });
    };

    const removeTag = (prov: string, loc: string) => {
        setSelectedLocalidades(prev => prev.filter(l => !(l.provincia === prov && l.localidad === loc)));
    };

    const isLocalidadSelected = (prov: string, loc: string) => {
        return selectedLocalidades.some(l => l.provincia === prov && l.localidad === loc);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="space-y-16 max-w-2xl mx-auto pb-32">
            {/* Provincias */}
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                <label className="text-3xl font-black text-slate-900 flex items-center gap-4 italic">
                    <Globe className="text-green-600 w-8 h-8" />
                    ¿En qué provincias operas?
                </label>
                <div className="flex flex-wrap gap-3">
                    {Object.keys(DATOS_GEO).sort().map((prov) => {
                        const isSelected = selectedProvincias.includes(prov);
                        return (
                            <motion.button
                                key={prov}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => toggleProvincia(prov)}
                                className={`
                                    px-6 py-3 rounded-2xl border-2 transition-all font-bold text-lg flex items-center gap-2
                                    ${isSelected
                                        ? 'bg-green-600 border-green-600 text-white shadow-lg shadow-green-100'
                                        : 'bg-white border-slate-100 text-slate-500 hover:border-green-200'}
                                `}
                            >
                                {prov}
                                {isSelected && <Check className="w-5 h-5" />}
                            </motion.button>
                        );
                    })}
                </div>
            </motion.div>

            {/* Localidades (Conditional) */}
            <AnimatePresence>
                {selectedProvincias.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-8 overflow-hidden"
                    >
                        <label className="text-3xl font-black text-slate-900 flex items-center gap-4 italic">
                            <MapPin className="text-green-600 w-8 h-8" />
                            Selecciona las localidades
                        </label>

                        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
                            <div className="max-h-[400px] overflow-y-auto p-4 space-y-8 custom-scrollbar">
                                {selectedProvincias.map((prov) => (
                                    <div key={prov} className="space-y-4">
                                        <h4 className="text-sm font-bold text-green-600 uppercase tracking-widest px-4">
                                            {prov}
                                        </h4>
                                        <div className="grid grid-cols-1 gap-2">
                                            {DATOS_GEO[prov].map((loc) => {
                                                const isSelected = isLocalidadSelected(prov, loc);
                                                return (
                                                    <button
                                                        key={`${prov}-${loc}`}
                                                        onClick={() => toggleLocalidad(prov, loc)}
                                                        className={`
                                                            flex items-center justify-between p-4 rounded-2xl transition-all text-left group
                                                            ${isSelected
                                                                ? 'bg-green-50 text-green-800'
                                                                : 'hover:bg-slate-50 text-slate-600'}
                                                        `}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className={`
                                                                w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all
                                                                ${isSelected ? 'bg-green-600 border-green-600' : 'border-slate-200 group-hover:border-green-300'}
                                                            `}>
                                                                {isSelected && <Check className="w-4 h-4 text-white" />}
                                                            </div>
                                                            <span className="text-xl font-medium">{loc}</span>
                                                        </div>
                                                        <ChevronRight className={`w-5 h-5 transition-transform ${isSelected ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} />
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tags seleccionadas */}
            <div className="space-y-4">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                    Seleccionadas ({selectedLocalidades.length})
                </label>
                <div className="flex flex-wrap gap-2 min-h-[60px]">
                    <AnimatePresence mode="popLayout">
                        {selectedLocalidades.map((loc) => (
                            <motion.div
                                key={`${loc.provincia}-${loc.localidad}`}
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="bg-green-600 text-white pl-4 pr-2 py-2 rounded-full flex items-center gap-2 shadow-md"
                            >
                                <span className="font-medium">{loc.localidad}</span>
                                <span className="text-green-200 text-xs">({loc.provincia})</span>
                                <button
                                    onClick={() => removeTag(loc.provincia, loc.localidad)}
                                    className="p-1 hover:bg-green-700 rounded-full transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {selectedLocalidades.length === 0 && (
                        <p className="text-slate-300 italic">Ninguna localidad seleccionada aún...</p>
                    )}
                </div>
            </div>

            {/* Submit */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={selectedLocalidades.length === 0 || isLoading}
                onClick={() => onSubmit({ provincias: selectedProvincias, localidades: selectedLocalidades })}
                className={`
                    w-full flex items-center justify-center gap-4 py-6 rounded-3xl text-2xl font-bold transition-all shadow-xl mt-10
                    ${selectedLocalidades.length > 0 && !isLoading
                        ? 'bg-[#FF6B6B] text-white hover:bg-[#fa5b4b] shadow-[#FF6B6B]/20'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
                `}
            >
                {isLoading ? (
                    <Loader2 className="animate-spin w-8 h-8" />
                ) : (
                    <>
                        Planificar mi Disponibilidad
                        <ArrowRight className="w-8 h-8" />
                    </>
                )}
            </motion.button>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `}</style>
        </div>
    );
}
