'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Calendar, Check, X, ArrowRight, Loader2, ChevronRight, Info } from 'lucide-react';
import { AvailabilityFormData, DAYS_OF_WEEK, TIME_SLOTS, AvailabilitySlot } from './types';

interface AvailabilityFormProps {
    onSubmit: (data: AvailabilityFormData) => void;
    isLoading?: boolean;
    defaultValues?: Partial<AvailabilityFormData>;
}

export function AvailabilityForm({ onSubmit, isLoading, defaultValues }: AvailabilityFormProps) {
    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const [selectedSlots, setSelectedSlots] = useState<AvailabilitySlot[]>(defaultValues?.slots || []);

    const toggleSlot = (day: string, slot: string) => {
        setSelectedSlots(prev => {
            const exists = prev.find(s => s.day === day && s.slot === slot);
            if (exists) {
                return prev.filter(s => !(s.day === day && s.slot === slot));
            } else {
                return [...prev, { day, slot }];
            }
        });
    };

    const removeTag = (day: string, slot: string) => {
        setSelectedSlots(prev => prev.filter(s => !(s.day === day && s.slot === slot)));
    };

    const isSlotSelected = (day: string, slot: string) => {
        return selectedSlots.some(s => s.day === day && s.slot === slot);
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
        <div className="space-y-12 max-w-2xl mx-auto pb-32">
            {/* Días de la semana */}
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                <label className="text-3xl font-black text-slate-900 flex items-center gap-4 italic leading-tight">
                    <Calendar className="text-[#4CAF50] w-8 h-8 flex-shrink-0" />
                    ¿Qué días podés guiar?
                </label>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                    {DAYS_OF_WEEK.map((day) => {
                        const isDayActive = selectedDay === day;
                        const dayHasSlots = selectedSlots.some(s => s.day === day);

                        return (
                            <motion.button
                                key={day}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedDay(isDayActive ? null : day)}
                                className={`
                                    px-5 py-3 rounded-2xl border-2 transition-all font-bold text-lg flex items-center gap-2
                                    ${isDayActive
                                        ? 'bg-[#4CAF50] border-[#4CAF50] text-white shadow-lg shadow-[#4CAF50]/20 scale-105'
                                        : dayHasSlots
                                            ? 'bg-green-50 border-[#4CAF50] text-[#4CAF50]'
                                            : 'bg-white border-slate-100 text-slate-500 hover:border-[#4CAF50]/40'}
                                `}
                            >
                                {day}
                                {dayHasSlots && !isDayActive && <Check className="w-4 h-4" />}
                            </motion.button>
                        );
                    })}
                </div>
            </motion.div>

            {/* Slots Horarios (Dynamic) */}
            <AnimatePresence mode="wait">
                {selectedDay && (
                    <motion.div
                        key={selectedDay}
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="space-y-8"
                    >
                        <div className="flex items-center justify-between">
                            <label className="text-3xl font-black text-slate-900 flex items-center gap-4 italic leading-tight">
                                <Clock className="text-[#4CAF50] w-8 h-8 flex-shrink-0" />
                                Franjas para {selectedDay}
                            </label>
                            <button
                                onClick={() => setSelectedDay(null)}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

                        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-100">
                                {TIME_SLOTS.map((slot) => {
                                    const isSelected = isSlotSelected(selectedDay, slot);
                                    return (
                                        <button
                                            key={slot}
                                            onClick={() => toggleSlot(selectedDay, slot)}
                                            className={`
                                                flex items-center justify-between p-6 bg-white transition-all text-left group
                                                ${isSelected
                                                    ? 'bg-green-50 text-[#4CAF50]'
                                                    : 'hover:bg-slate-50 text-slate-600'}
                                            `}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`
                                                    w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all
                                                    ${isSelected ? 'bg-[#4CAF50] border-[#4CAF50]' : 'border-slate-200 group-hover:border-[#4CAF50]/60'}
                                                `}>
                                                    {isSelected && <Check className="w-4 h-4 text-white" />}
                                                </div>
                                                <span className="text-xl font-medium">{slot}</span>
                                            </div>
                                            <ChevronRight className={`w-5 h-5 transition-transform ${isSelected ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Aviso de selección */}
            {!selectedDay && selectedSlots.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-100 text-slate-500"
                >
                    <Info className="w-6 h-6 text-slate-400 flex-shrink-0" />
                    <p className="text-lg">Selecciona un día para ver y elegir tus franjas horarias disponibles.</p>
                </motion.div>
            )}

            {/* Tags seleccionadas */}
            <div className="space-y-6">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    Tu Plan de Disponibilidad ({selectedSlots.length})
                </label>
                <div className="flex flex-wrap gap-2 sm:gap-3 min-h-[60px]">
                    <AnimatePresence mode="popLayout">
                        {selectedSlots.sort((a, b) => DAYS_OF_WEEK.indexOf(a.day) - DAYS_OF_WEEK.indexOf(b.day)).map((s) => (
                            <motion.div
                                key={`${s.day}-${s.slot}`}
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="bg-[#4CAF50] text-white pl-5 pr-2 py-3 rounded-2xl flex items-center gap-3 shadow-md border-b-4 border-black/10"
                            >
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold uppercase opacity-80">{s.day}</span>
                                    <span className="font-black text-lg leading-tight">{s.slot}</span>
                                </div>
                                <button
                                    onClick={() => removeTag(s.day, s.slot)}
                                    className="p-1.5 hover:bg-black/10 rounded-xl transition-colors ml-2"
                                >
                                    <X className="w-5 h-5 text-white/80 hover:text-[#FF6B6B]" />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {selectedSlots.length === 0 && (
                        <p className="text-slate-300 italic text-lg pt-2">Ninguna franja seleccionada aún...</p>
                    )}
                </div>
            </div>

            {/* Submit */}
            <motion.div variants={itemVariants} className="pt-10">
                <button
                    disabled={selectedSlots.length === 0 || isLoading}
                    onClick={() => onSubmit({ slots: selectedSlots })}
                    className={`
                        w-full group flex items-center justify-center gap-4 py-7 rounded-3xl text-2xl font-black transition-all shadow-xl
                        ${selectedSlots.length > 0 && !isLoading
                            ? 'bg-[#FF6B6B] text-white hover:bg-[#fa5b4b] hover:scale-[1.02] shadow-[#FF6B6B]/30'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
                    `}
                >
                    {isLoading ? (
                        <Loader2 className="animate-spin w-8 h-8" />
                    ) : (
                        <>
                            Finalizar Registro
                            <ArrowRight className="w-8 h-8 transition-transform group-hover:translate-x-2" />
                        </>
                    )}
                </button>
            </motion.div>

            <style jsx>{`
                /* Estilos ripple y efectos living input */
                .shadow-[#4CAF50]/20 {
                    box-shadow: 0 10px 15px -3px rgba(76, 175, 80, 0.2), 0 4px 6px -2px rgba(76, 175, 80, 0.1);
                }
                .shadow-[#FF6B6B]/30 {
                    box-shadow: 0 10px 25px -5px rgba(255, 107, 107, 0.3), 0 8px 10px -6px rgba(255, 107, 107, 0.2);
                }
            `}</style>
        </div>
    );
}
