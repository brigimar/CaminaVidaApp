import { NextRequest, NextResponse } from "next/server";

/**
 * ENDPOINT: /api/coordinator/geo
 * Tablas: coordinator_geo_availability
 * Auditoría: coordinator_panel_logs (trigger update_geo)
 * Seguridad: x-coordinator-id
 */

export async function GET(req: NextRequest) {
    try {
        const coordinator_id = req.headers.get("x-coordinator-id");
        if (!coordinator_id) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

        // MCP Server directo
        const { data, error } = await mcp.from("coordinator_geo_availability")
            .select("zone_name")
            .eq("coordinator_id", coordinator_id);

        if (error) throw error;

        return NextResponse.json({ success: true, data: data.map(d => d.zone_name) });
    } catch (err: any) {
        console.error("[API_GEO_ERROR]:", err);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const coordinator_id = req.headers.get("x-coordinator-id");
        if (!coordinator_id) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const { zones } = body as { zones: string[] };
        if (!Array.isArray(zones)) return NextResponse.json({ success: false, error: "Invalid format" }, { status: 400 });

        const uniqueZones = Array.from(new Set(zones));
        // Delete & Insert strategy
        const { error: delError } = await mcp.from("coordinator_geo_availability").delete().eq("coordinator_id", coordinator_id);
        if (delError) throw delError;

        if (uniqueZones.length > 0) {
            const { error: insertError } = await mcp.from("coordinator_geo_availability")
                .insert(uniqueZones.map(zone => ({ coordinator_id, zone_name: zone })));
            if (insertError) throw insertError;
        }

        // Auditoría
        await mcp.from("coordinator_panel_logs").insert({
            coordinator_id,
            action: "update_geo",
            details: { zones: uniqueZones, timestamp: new Date().toISOString() }
        });

        return NextResponse.json({ success: true, message: "Zones updated successfully" });
    } catch (err: any) {
        console.error("[API_GEO_ERROR]:", err);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
