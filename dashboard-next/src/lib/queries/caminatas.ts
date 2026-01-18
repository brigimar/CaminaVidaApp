import { supabaseServer } from "../supabase/server";
import { RiskState } from "../types/caminata";

export async function getWalksWithActiveRisk(): Promise<RiskState[]> {
    const { data, error } = await supabaseServer
        .from("walk_ledger_links")
        .select(`
      walk_id,
      gps_verified,
      participants_count,
      max_capacity,
      created_at
    `);

    if (error) throw error;

    return data.map((walk: any) => {
        let severity: RiskState["severity"] = "OK";
        let reason = "Valid walk";

        // Logic inferred from available columns
        if (walk.gps_verified === false) {
            // Explicit false check if nullable
            severity = "WARNING";
            reason = "GPS not verified";
        } else if (walk.max_capacity > 0 && walk.participants_count > walk.max_capacity) {
            severity = "WARNING";
            reason = "Participants exceed capacity";
        } else if (walk.participants_count === 0) {
            severity = "INFO";
            reason = "No participants";
        }

        return {
            walk_id: walk.walk_id,
            severity,
            reason,
            last_evaluation_at: walk.created_at, // Mapped from created_at
        };
    });
}
