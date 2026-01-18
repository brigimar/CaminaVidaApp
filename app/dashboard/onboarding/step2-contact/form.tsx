'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Map, ArrowRight, Loader2, Check } from 'lucide-react';
import { ContactFormData, AVAILABLE_ZONES } from './types';

const contactSchema = z.object({
    email: z.string().email('Ingresa un correo electrónico válido'),
    telefono: z.string().optional().refine((val) => {
        if (!val) return true;
        // Solo números, 10 dígitos (formato argentino celular/fijo sin 0 ni 15)
        return /^\d{10}$/.test(val.replace(/\D/g, ''));
    }, 'El teléfono debe tener 10 dígitos (ej: 1123456789)'),
    direccion: z.string().optional(),
    zonas: z.array(z.string()).min(1, 'Selecciona al menos una zona de cobertura'),
});

interface ContactFormProps {
    onSubmit: (data: ContactFormData) => void;
    isLoading?: boolean;
    defaultValues?: Partial<ContactFormData>;
}

export function ContactForm({ onSubmit, isLoading, defaultValues }: ContactFormProps) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isValid },
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
        mode: 'onChange',
        defaultValues: defaultValues || { zonas: [] },
    });

    const selectedZones = watch('zonas') || [];

    const toggleZone = (zone: string) => {
        const current = [...selectedZones];
        const index = current.indexOf(zone);
        if (index > -1) {
            current.splice(index, 1);
        } else {
            current.push(zone);
        }
        setValue('zonas', current, { shouldValidate: true });
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
    };

    return (
        <motion.form
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-12 max-w-xl mx-auto pb-20"
        >
            {/* Input Email */}
            <motion.div variants={itemVariants} className="group flex flex-col space-y-3">
                <label className="text-2xl font-medium text-slate-800 flex items-center gap-3">
                    <Mail className="text-green-600 w-6 h-6" />
                    ¿Cuál es tu email? *
                </label>
                <input
                    {...register('email')}
                    type="email"
                    placeholder="nombre@ejemplo.com"
                    className="text-3xl py-4 bg-transparent border-b-2 border-slate-200 focus:border-green-600 outline-none transition-all placeholder:text-slate-300"
                />
                {errors.email && (
                    <span className="text-coral-500 text-sm font-medium">{errors.email.message}</span>
                )}
            </motion.div>

            {/* Input Teléfono */}
            <motion.div variants={itemVariants} className="group flex flex-col space-y-3">
                <label className="text-2xl font-medium text-slate-800 flex items-center gap-3">
                    <Phone className="text-green-600 w-6 h-6" />
                    Teléfono de contacto
                </label>
                <input
                    {...register('telefono')}
                    placeholder="11 2345 6789"
                    className="text-3xl py-4 bg-transparent border-b-2 border-slate-200 focus:border-green-600 outline-none transition-all placeholder:text-slate-300"
                />
                <p className="text-slate-400 text-sm">Sin el 0 ni el 15. Solo los 10 dígitos.</p>
                {errors.telefono && (
                    <span className="text-coral-500 text-sm font-medium">{errors.telefono.message}</span>
                )}
            </motion.div>

            {/* Input Dirección */}
            <motion.div variants={itemVariants} className="group flex flex-col space-y-3">
                <label className="text-2xl font-medium text-slate-800 flex items-center gap-3">
                    <MapPin className="text-green-600 w-6 h-6" />
                    ¿Dónde vives?
                </label>
                <input
                    {...register('direccion')}
                    placeholder="Calle, Número, Ciudad..."
                    className="text-3xl py-4 bg-transparent border-b-2 border-slate-200 focus:border-green-600 outline-none transition-all placeholder:text-slate-300"
                />
            </motion.div>

            {/* Zonas de Cobertura */}
            <motion.div variants={itemVariants} className="group flex flex-col space-y-5">
                <label className="text-2xl font-medium text-slate-800 flex items-center gap-3">
                    <Map className="text-green-600 w-6 h-6" />
                    Zonas donde puedes coordinar *
                </label>
                <div className="grid grid-cols-2 gap-3">
                    {AVAILABLE_ZONES.map((zone) => {
                        const isSelected = selectedZones.includes(zone);
                        return (
                            <button
                                key={zone}
                                type="button"
                                onClick={() => toggleZone(zone)}
                                className={`
                                    flex items-center justify-between px-5 py-4 rounded-2xl border-2 text-left transition-all
                                    ${isSelected
                                        ? 'bg-green-50 border-green-600 text-green-800 font-bold'
                                        : 'border-slate-100 text-slate-500 hover:border-green-200'}
                                `}
                            >
                                {zone}
                                {isSelected && <Check className="w-5 h-5 text-green-600" />}
                            </button>
                        );
                    })}
                </div>
                {errors.zonas && (
                    <span className="text-coral-500 text-sm font-medium">{errors.zonas.message}</span>
                )}
            </motion.div>

            {/* Botón Siguiente */}
            <motion.div variants={itemVariants} className="pt-10">
                <button
                    disabled={!isValid || isLoading}
                    className={`
                        w-full flex items-center justify-center gap-4 py-6 rounded-3xl text-2xl font-bold transition-all shadow-xl
                        ${isValid && !isLoading
                            ? 'bg-coral-500 text-white hover:bg-coral-600 hover:scale-[1.02] shadow-coral-100 cursor-pointer'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
                    `}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="animate-spin w-8 h-8" />
                            Guardando...
                        </>
                    ) : (
                        <>
                            Guardar y continuar
                            <ArrowRight className="w-8 h-8" />
                        </>
                    )}
                </button>
            </motion.div>

            <style jsx>{`
                .text-coral-500 { color: #ff6f61; }
                .bg-coral-500 { background-color: #ff6f61; }
                .bg-coral-600 { background-color: #fa5b4b; }
                .shadow-coral-100 { shadow-color: rgba(255, 111, 97, 0.2); }
            `}</style>
        </motion.form>
    );
}
