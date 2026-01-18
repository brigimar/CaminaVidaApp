import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '../../../lib/queries'; // Asegurarte que aquí tienes tu conexión a DB
import type { CoordinatorSkill } from '../../../lib/types/coordinador';

const skillSchema = z.object({
    skill_name: z.string().min(1),
    rating: z.number().int().min(1).max(5),
});

export async function GET(req: NextRequest) {
    try {
        const coordinator_id = req.headers.get('x-coordinator-id'); // ejemplo: tomar ID de auth
        if (!coordinator_id) return NextResponse.json({ error: 'Missing coordinator_id' }, { status: 400 });

        const skills: CoordinatorSkill[] = await db('coordinator_skills')
            .select('*')
            .where({ coordinator_id });

        return NextResponse.json({ success: true, skills });
    } catch (error) {
        console.error('Error fetching skills:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch skills' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const coordinator_id = req.headers.get('x-coordinator-id');
        if (!coordinator_id) return NextResponse.json({ error: 'Missing coordinator_id' }, { status: 400 });

        const body = await req.json();
        const parsed = skillSchema.safeParse(body);
        if (!parsed.success) return NextResponse.json({ success: false, error: parsed.error.errors }, { status: 400 });

        const { skill_name, rating } = parsed.data;

        // Upsert: si existe la skill para este coordinador, actualiza; si no, inserta
        const existing = await db('coordinator_skills')
            .where({ coordinator_id, skill_name })
            .first();

        if (existing) {
            await db('coordinator_skills')
                .update({ rating })
                .where({ coordinator_id, skill_name });
        } else {
            await db('coordinator_skills').insert({ coordinator_id, skill_name, rating });
        }

        // Trigger trg_log_skills_update se activará automáticamente → log en coordinator_panel_logs

        return NextResponse.json({ success: true, skill_name, rating });
    } catch (error) {
        console.error('Error saving skill:', error);
        return NextResponse.json({ success: false, error: 'Failed to save skill' }, { status: 500 });
    }
}
