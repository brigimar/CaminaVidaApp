import { NextRequest, NextResponse } from "next/server";
import { db as mcp } from '@/lib/supabase/server';

/**
 * ENDPOINT: /api/coordinator/score
 * Tablas: coord_scorecamina, coordinadores_bio, coordinator_skills, coordinator_availability, coordinator_geo_availability, coordinadores
 * Auditoría: coordinator_panel_logs (trigger recalc_score)
 * Seguridad: x-coordinator-id
 */

export async function POST(req: NextRequest) {
    try {
        const coordinator_id = req.headers.get("x-coordinator-id");
        if (!coordinator_id) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

        // MCP Server: consultar datos de scoring
        const [
            { data: scoreData },
            { data: bioData },
            { data: skillsData },
            { count: availCount },
            { count: geoCount }
        ] = await Promise.all([
            mcp.from("coord_scorecamina").select("streak_count").eq("coordinator_id", coordinator_id).single(),
            mcp.from("coordinadores_bio").select("motivacion_json").eq("coordinator_id", coordinator_id).single(),
            mcp.from("coordinator_skills").select("rating").eq("coordinator_id", coordinator_id),
            mcp.from("coordinator_availability").select("*", { count: "exact", head: true }).eq("coordinator_id", coordinator_id),
            mcp.from("coordinator_geo_availability").select("*", { count: "exact", head: true }).eq("coordinator_id", coordinator_id)
        ]);

        const streak = scoreData?.streak_count || 0;
        const weighted_streak = Math.min(streak * 10, 100) * 0.35;
        const weighted_motiv = (bioData?.motivacion_json ? 100 : 0) * 0.20;

        let avgRating = 0;
        if (skillsData?.length) avgRating = skillsData.reduce((acc, s) => acc + (s.rating || 0), 0) / skillsData.length;
        const weighted_skills = (avgRating / 5 * 100) * 0.20;

        const weighted_avail = ((availCount || 0) > 0 ? 100 : 0) * 0.20;
        const weighted_geo = ((geoCount || 0) > 0 ? 100 : 0) * 0.05;

        const totalScore = Math.round(weighted_streak + weighted_motiv + weighted_skills + weighted_avail + weighted_geo);

        const { error: updateError } = await mcp.from("coordinadores")
            .update({ score: totalScore })
            .eq("id", coordinator_id);
        if (updateError) console.warn("Could not update coordinadores.score", updateError.message);

        await mcp.from("coordinator_panel_logs").insert({
            coordinator_id,
            action: "recalc_score",
            details: {
                total: totalScore,
                breakdown: {
                    streak, motivation: !!bioData?.motivacion_json, skills_avg: avgRating, avail_count: availCount, geo_count: geoCount
                },
                timestamp: new Date().toISOString()
            }
        });

        return NextResponse.json({
            success: true,
            data: {
                totalScore,
                breakdown: { weighted_streak, weighted_motiv, weighted_skills, weighted_avail, weighted_geo }
            }
        });
    } catch (err: any) {
        console.error("[API_SCORE_ERROR]:", err);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
