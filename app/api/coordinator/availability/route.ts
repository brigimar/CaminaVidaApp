import { NextRequest, NextResponse } from 'next/server';
import { db as mcp } from '@/lib/supabase/server';

interface AvailabilityBlock {
    day: string;
    start_time: string; // HH:mm
    end_time: string;   // HH:mm
}

function calculateDurationHours(start: string, end: string): number {
    const [h1, m1] = start.split(':').map(Number);
    const [h2, m2] = end.split(':').map(Number);
    const date1 = new Date(0, 0, 0, h1, m1);
    const date2 = new Date(0, 0, 0, h2, m2);
    // Handle crossing midnight defined by start > end? Assuming strict day blocks for now
    const diffMs = date2.getTime() - date1.getTime();
    return diffMs / (1000 * 60 * 60);
}

function checkOverlap(blocks: AvailabilityBlock[]): boolean {
    // Sort by day and start time
    const sorted = [...blocks].sort((a, b) => {
        if (a.day !== b.day) return a.day.localeCompare(b.day);
        return a.start_time.localeCompare(b.start_time);
    });

    for (let i = 0; i < sorted.length - 1; i++) {
        const current = sorted[i];
        const next = sorted[i + 1];

        if (current.day === next.day) {
            if (current.end_time > next.start_time) {
                return true; // Overlap
            }
        }
    }
    return false;
}

export async function POST(req: NextRequest) {
    try {
        const coordinator_id = req.headers.get('x-coordinator-id');
        if (!coordinator_id) {
            return NextResponse.json({ success: false, error: 'Unauthorized: Missing coordinator ID' }, { status: 401 });
        }

        const body = await req.json();
        const { availability } = body as { availability: AvailabilityBlock[] };

        if (!Array.isArray(availability)) {
            return NextResponse.json({ success: false, error: 'Invalid format: availability must be an array' }, { status: 400 });
        }

        // Validaciones
        // 1. Duración mínima 2 horas
        for (const block of availability) {
            const duration = calculateDurationHours(block.start_time, block.end_time);
            if (duration < 2) {
                return NextResponse.json({
                    success: false,
                    error: `Block ${block.day} ${block.start_time}-${block.end_time} is less than 2 hours`
                }, { status: 400 });
            }
        }

        // 2. No solapamiento
        if (checkOverlap(availability)) {
            return NextResponse.json({ success: false, error: 'Overlapping availability blocks detected' }, { status: 400 });
        }

        // Prepare rows
        const rows = availability.map(block => ({
            coordinator_id,
            day: block.day,
            start_time: block.start_time,
            end_time: block.end_time
        }));

        // Transaction-like approach: Delete old -> Insert new
        // Note: Supabase-js doesn't support transactions purely from client without RPC. 
        // We assume acceptable risk here or use RPC if "apply_migration" tool was allowed for functions, but we are writing route.ts.
        // "mcp" here is just the client. 

        // Delete existing
        const { error: deleteError } = await mcp
            .from('coordinator_availability')
            .delete()
            .eq('coordinator_id', coordinator_id);

        if (deleteError) {
            console.error('Error deleting old availability:', deleteError);
            return NextResponse.json({ success: false, error: 'Failed to clear old availability' }, { status: 500 });
        }

        // Insert new
        if (rows.length > 0) {
            const { error: insertError } = await mcp
                .from('coordinator_availability')
                .insert(rows);

            if (insertError) {
                console.error('Error inserting availability:', insertError);
                return NextResponse.json({ success: false, error: 'Failed to save availability' }, { status: 500 });
            }
        }

        // Auditoría
        await mcp.from('coordinator_panel_logs').insert({
            coordinator_id,
            action: 'update_availability',
            details: { count: rows.length, timestamp: new Date().toISOString() }
        });

        return NextResponse.json({ success: true, message: 'Availability updated successfully' });

    } catch (error) {
        console.error('Server error in availability:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const coordinator_id = req.headers.get('x-coordinator-id');
    if (!coordinator_id) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await mcp
        .from('coordinator_availability')
        .select('*')
        .eq('coordinator_id', coordinator_id);

    if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
}
