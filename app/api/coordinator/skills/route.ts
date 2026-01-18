import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/queries'; // Asegurarte que aquí tienes tu conexión a DB
import type { CoordinatorSkill } from '@/lib/types/coordinador';

const skillSchema = z.object({
    skill_name: z.string().min(1),
    rating: z.number().int().min(1).max(5),
});

export async function GET(req: NextRequest) {
    try {
        const coordinator_id = req.headers.get('x-coordinator-id');
        if (!coordinator_id) return NextResponse.json({ error: 'Missing coordinator_id' }, { status: 400 });

        const { data: skills, error } = await db
            .from('coordinator_skills')
            .select('*')
            .eq('coordinator_id', coordinator_id);

        if (error) throw error;

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
        if (!parsed.success) return NextResponse.json({ success: false, error: parsed.error }, { status: 400 });

        const { skill_name, rating } = parsed.data;

        // Upsert usando Supabase
        const { error } = await db
            .from('coordinator_skills')
            .upsert({
                coordinator_id,
                skill_name,
                rating
            }, { onConflict: 'coordinator_id,skill_name' });

        if (error) throw error;

        return NextResponse.json({ success: true, skill_name, rating });
    } catch (error) {
        console.error('Error saving skill:', error);
        return NextResponse.json({ success: false, error: 'Failed to save skill' }, { status: 500 });
    }
}
