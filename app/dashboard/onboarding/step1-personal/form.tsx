'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { User, CreditCard, Calendar, Users, ArrowRight, Loader2 } from 'lucide-react';
import { PersonalFormData } from './types';

const personalSchema = z.object({
    nombre: z.string().min(2, 'El nombre es requerido y debe tener al menos 2 caracteres'),
    apellido: z.string().min(2, 'El apellido es requerido y debe tener al menos 2 caracteres'),
    dni: z.string().regex(/^\d+$/, 'El DNI debe contener solo números').min(7, 'DNI inválido').max(10, 'DNI inválido'),
    fecha_nacimiento: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Fecha de nacimiento inválida',
    }),
    genero: z.enum(['Hombre', 'Mujer', 'Otro'], {
        message: 'Selecciona una opción de género',
    }),
});

interface PersonalFormProps {
    onSubmit: (data: PersonalFormData) => void;
    isLoading?: boolean;
    defaultValues?: Partial<PersonalFormData>;
}

export function PersonalForm({ onSubmit, isLoading, defaultValues }: PersonalFormProps) {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isValid },
    } = useForm<PersonalFormData>({
        resolver: zodResolver(personalSchema),
        mode: 'onChange',
        defaultValues: defaultValues,
    });

    const watchedGenero = watch('genero');

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                staggerChildren: 0.1,
            },
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
            className="space-y-12 max-w-xl mx-auto"
        >
            {/* Input Nombre */}
            <motion.div variants={itemVariants} className="group flex flex-col space-y-3">
                <label className="text-2xl font-medium text-slate-800 flex items-center gap-3">
                    <User className="text-green-600 w-6 h-6" />
                    ¿Cuál es tu nombre? *
                </label>
                <input
                    {...register('nombre')}
                    placeholder="Escribe tu nombre aquí..."
                    className="text-3xl py-4 bg-transparent border-b-2 border-slate-200 focus:border-green-600 outline-none transition-all placeholder:text-slate-300"
                />
                {errors.nombre && (
                    <span className="text-coral-500 text-sm font-medium">{errors.nombre.message}</span>
                )}
            </motion.div>

            {/* Input Apellido */}
            <motion.div variants={itemVariants} className="group flex flex-col space-y-3">
                <label className="text-2xl font-medium text-slate-800 flex items-center gap-3">
                    <User className="text-green-600 w-6 h-6" />
                    ¿Y tu apellido? *
                </label>
                <input
                    {...register('apellido')}
                    placeholder="Escribe tu apellido aquí..."
                    className="text-3xl py-4 bg-transparent border-b-2 border-slate-200 focus:border-green-600 outline-none transition-all placeholder:text-slate-300"
                />
                {errors.apellido && (
                    <span className="text-coral-500 text-sm font-medium">{errors.apellido.message}</span>
                )}
            </motion.div>

            {/* Input DNI */}
            <motion.div variants={itemVariants} className="group flex flex-col space-y-3">
                <label className="text-2xl font-medium text-slate-800 flex items-center gap-3">
                    <CreditCard className="text-green-600 w-6 h-6" />
                    Tu número de DNI *
                </label>
                <input
                    {...register('dni')}
                    placeholder="Solo números..."
                    className="text-3xl py-4 bg-transparent border-b-2 border-slate-200 focus:border-green-600 outline-none transition-all placeholder:text-slate-300"
                />
                {errors.dni && (
                    <span className="text-coral-500 text-sm font-medium">{errors.dni.message}</span>
                )}
            </motion.div>

            {/* Input Fecha Nacimiento */}
            <motion.div variants={itemVariants} className="group flex flex-col space-y-3">
                <label className="text-2xl font-medium text-slate-800 flex items-center gap-3">
                    <Calendar className="text-green-600 w-6 h-6" />
                    Fecha de nacimiento *
                </label>
                <input
                    type="date"
                    {...register('fecha_nacimiento')}
                    className="text-3xl py-4 bg-transparent border-b-2 border-slate-200 focus:border-green-600 outline-none transition-all cursor-pointer"
                />
                {errors.fecha_nacimiento && (
                    <span className="text-coral-500 text-sm font-medium">{errors.fecha_nacimiento.message}</span>
                )}
            </motion.div>

            {/* Input Género */}
            <motion.div variants={itemVariants} className="group flex flex-col space-y-3">
                <label className="text-2xl font-medium text-slate-800 flex items-center gap-3">
                    <Users className="text-green-600 w-6 h-6" />
                    Género *
                </label>
                <div className="flex flex-wrap gap-4 pt-4">
                    {['Hombre', 'Mujer', 'Otro'].map((option) => (
                        <label
                            key={option}
                            className={`
                                cursor-pointer px-8 py-4 rounded-2xl border-2 transition-all text-xl font-bold
                                ${watchedGenero === option
                                    ? 'bg-green-600 border-green-600 text-white shadow-lg shadow-green-100'
                                    : 'border-slate-200 text-slate-500 hover:border-green-400'}
                            `}
                        >
                            <input
                                type="radio"
                                value={option}
                                {...register('genero')}
                                className="hidden"
                            />
                            {option}
                        </label>
                    ))}
                </div>
                {errors.genero && (
                    <span className="text-coral-500 text-sm font-medium">{errors.genero.message}</span>
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
                            Siguiente paso
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
                input[type="date"]::-webkit-calendar-picker-indicator {
                    filter: invert(15%) sepia(95%) saturate(6932%) hue-rotate(134deg) brightness(98%) contrast(107%);
                }
            `}</style>
        </motion.form>
    );
}
