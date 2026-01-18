import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/**
 * ENDPOINT: /api/coordinator/photo
 * Tablas: coordinadores_bio
 * Auditoría: coordinator_panel_logs (trigger update_foto)
 * Seguridad: x-coordinator-id
 */

const photoSchema = z.object({
    foto_url: z.string().url().nonempty()
});

export async function POST(req: NextRequest) {
    try {
        const coordinator_id = req.headers.get("x-coordinator-id");
        if (!coordinator_id) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const parsed = photoSchema.safeParse(body);
        if (!parsed.success) return NextResponse.json({ success: false, error: "Invalid URL format" }, { status: 400 });

        const { foto_url } = parsed.data;

        const { error } = await mcp.from("coordinadores_bio")
            .update({ foto_url })
            .eq("coordinator_id", coordinator_id);
        if (error) throw error;

        await mcp.from("coordinator_panel_logs").insert({
            coordinator_id,
            action: "update_foto",
            details: { url_length: foto_url.length, timestamp: new Date().toISOString() }
        });

        return NextResponse.json({ success: true, message: "Photo updated successfully" });
    } catch (err: any) {
        console.error("[API_PHOTO_ERROR]:", err);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
