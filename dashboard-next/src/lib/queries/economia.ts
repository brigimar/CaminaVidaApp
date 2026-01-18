import { supabaseServer } from "../supabase/server";
import { RiskState } from "../types/ledger";

export async function getEconomicRisks(): Promise<RiskState[]> {
    const { data, error } = await supabaseServer
        .from("economic_events")
        .select(`
      id,
      actor_id,
      reviewed_flag,
      hash,
      prev_hash,
      created_at
    `);

    if (error) throw error;

    return data.map((evt: any) => {
        let severity: RiskState["severity"] = "OK";
        let reason = "Healthy event";

        // Logic inferred from available columns
        if (!evt.hash) {
            severity = "BLOCKER";
            reason = "Missing integrity hash";
        } else if (evt.reviewed_flag === false) {
            // Assuming unreviewed might be an info/warning item, or just standard state.
            // Given 'hold' is missing, we can't be sure, staying conservative.
            severity = "INFO";
            reason = "Pending review";
        }

        // Basic consistency check (very weak without full chain verification)
        if (evt.id > 1 && !evt.prev_hash) {
            severity = "CRITICAL";
            reason = "Broken hash chain (missing prev_hash)";
        }

        return {
            event_id: evt.id,
            severity,
            reason,
            last_evaluation_at: evt.created_at, // Mapped from created_at
        };
    });
}
