'use client';

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, ArrowRight, Loader2, Sparkles, Trophy, CheckCircle2 } from 'lucide-react';
import { SkillsFormData, PREDEFINED_SKILLS, SkillRating } from './types';

const skillRatingSchema = z.object({
    skill_name: z.string(),
    rating: z.number().min(1, 'Califica esta habilidad').max(5),
    comment: z.string().max(200, 'Máximo 200 caracteres').optional(),
});

const skillsSchema = z.object({
    experience_years: z.string().min(1, 'Cuéntanos cuánto tiempo llevas en esto'),
    motivation: z.string().min(10, 'Cuéntanos un poco más sobre tu motivación'),
    skills: z.array(skillRatingSchema).min(1, 'Selecciona al menos una habilidad'),
});

interface SkillsFormProps {
    onSubmit: (data: SkillsFormData) => void;
    isLoading?: boolean;
    defaultValues?: Partial<SkillsFormData>;
}

export function SkillsForm({ onSubmit, isLoading, defaultValues }: SkillsFormProps) {
    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors, isValid },
    } = useForm<SkillsFormData>({
        resolver: zodResolver(skillsSchema),
        mode: 'onChange',
        defaultValues: defaultValues || { skills: [], experience_years: '', motivation: '' },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'skills',
    });

    const selectedSkills = watch('skills') || [];

    const toggleSkill = (skillName: string) => {
        const index = selectedSkills.findIndex(s => s.skill_name === skillName);
        if (index > -1) {
            remove(index);
        } else {
            append({ skill_name: skillName, rating: 0, comment: '' });
        }
    };

    const setRating = (skillName: string, rating: number) => {
        const index = selectedSkills.findIndex(s => s.skill_name === skillName);
        if (index > -1) {
            setValue(`skills.${index}.rating`, rating, { shouldValidate: true });
        }
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
        <motion.form
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-16 max-w-2xl mx-auto pb-32"
        >
            {/* Preguntas Generales */}
            <motion.div variants={itemVariants} className="space-y-12">
                <div className="group flex flex-col space-y-4">
                    <label className="text-2xl font-medium text-slate-800 flex items-center gap-3">
                        <Trophy className="text-green-600 w-6 h-6" />
                        ¿Cuánto tiempo llevas acompañando grupos? *
                    </label>
                    <select
                        {...register('experience_years')}
                        className="text-2xl py-4 bg-transparent border-b-2 border-slate-200 focus:border-green-600 outline-none transition-all appearance-none cursor-pointer"
                    >
                        <option value="">Selecciona una opción...</option>
                        <option value="menos-1">Menos de 1 año</option>
                        <option value="1-3">Entre 1 y 3 años</option>
                        <option value="3-5">Entre 3 y 5 años</option>
                        <option value="mas-5">Más de 5 años</option>
                    </select>
                    {errors.experience_years && (
                        <span className="text-coral-500 text-sm">{errors.experience_years.message}</span>
                    )}
                </div>

                <div className="group flex flex-col space-y-4">
                    <label className="text-2xl font-medium text-slate-800 flex items-center gap-3">
                        <Sparkles className="text-green-600 w-6 h-6" />
                        ¿Qué te motiva de Camina Vida? *
                    </label>
                    <textarea
                        {...register('motivation')}
                        placeholder="Tu pasión nos inspira..."
                        rows={3}
                        className="text-2xl py-4 bg-transparent border-b-2 border-slate-200 focus:border-green-600 outline-none transition-all placeholder:text-slate-300 resize-none"
                    />
                    {errors.motivation && (
                        <span className="text-coral-500 text-sm">{errors.motivation.message}</span>
                    )}
                </div>
            </motion.div>

            {/* Fichas de Habilidades */}
            <motion.div variants={itemVariants} className="space-y-8">
                <h3 className="text-3xl font-black text-slate-900 flex items-center gap-3 italic">
                    Tus Habilidades
                </h3>

                <div className="flex flex-wrap gap-3">
                    {PREDEFINED_SKILLS.map((skill) => {
                        const isSelected = selectedSkills.some(s => s.skill_name === skill);
                        return (
                            <button
                                key={skill}
                                type="button"
                                onClick={() => toggleSkill(skill)}
                                className={`
                                    px-6 py-3 rounded-full border-2 transition-all font-bold text-lg
                                    ${isSelected
                                        ? 'bg-green-600 border-green-600 text-white shadow-lg shadow-green-100 scale-105'
                                        : 'bg-white border-slate-100 text-slate-500 hover:border-green-200'}
                                `}
                            >
                                {skill}
                            </button>
                        );
                    })}
                </div>

                {/* Ratings Interactivos */}
                <div className="space-y-6 pt-6">
                    <AnimatePresence mode="popLayout">
                        {selectedSkills.map((skill, index) => (
                            <motion.div
                                key={skill.skill_name}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-xl font-bold text-slate-800">
                                        {skill.skill_name}
                                    </span>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(skill.skill_name, star)}
                                                className="focus:outline-none transition-transform hover:scale-125 active:scale-95"
                                            >
                                                <Star
                                                    className={`w-8 h-8 ${star <= (skill.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100 focus-within:border-green-400">
                                    <MessageSquare className="w-5 h-5 text-slate-400" />
                                    <input
                                        {...register(`skills.${index}.comment`)}
                                        placeholder="Comentario opcional..."
                                        className="w-full bg-transparent outline-none text-slate-600"
                                    />
                                </div>
                                {errors.skills?.[index]?.rating && (
                                    <span className="text-coral-500 text-xs font-medium">Calificación requerida</span>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
                {errors.skills && !Array.isArray(errors.skills) && (
                    <span className="text-coral-500 text-sm font-medium">Selecciona al menos una habilidad</span>
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
                            Continuar
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
