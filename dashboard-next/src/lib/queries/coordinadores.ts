// dashboard-next/src/lib/queries/coordinadores.ts

import { supabaseServer } from "../supabase/server";
import { RiskState } from "../../types/coordinador";

/**
 * Resumen agregado de todos los coordinadores
 * Devuelve la cantidad de coordinadores en cada severidad
 */
export async function getCoordinatorsHealthSummary(): Promise<Record<string, number>> {
    const { data, error } = await supabaseServer
        .from("coord_scorecamina")
        .select("coordinator_id, streak_count, gamification_paused");

    if (error) throw error;

    const summary: Record<string, number> = { OK: 0, INFO: 0, WARNING: 0, CRITICAL: 0, BLOCKER: 0 };

    data.forEach((coord: any) => {
        let severity: RiskState["severity"] = "OK";

        // Thresholds de riesgo
        if (coord.streak_count === 0) severity = "CRITICAL";
        else if (coord.streak_count <= 2) severity = "WARNING";
        else if (coord.streak_count <= 4) severity = "INFO";
        else severity = "OK";

        if (coord.gamification_paused) severity = "INFO";

        summary[severity] += 1;
    });

    return summary;
}

/**
 * Lista de coordinadores con riesgo activo
 * Devuelve severity, reason y timestamp de la última evaluación
 */
export async function getCoordinatorsWithActiveRisk(): Promise<RiskState[]> {
    const { data, error } = await supabaseServer
        .from("coord_scorecamina")
        .select(`
      coordinator_id,
      streak_count,
      gamification_paused,
      metrics_json,
      last_evaluation_at
    `);

    if (error) throw error;

    return data.map((coord: any) => {
        let severity: RiskState["severity"] = "OK";
        let reason = "Healthy streak";

        // Evaluación de racha
        if (coord.streak_count === 0) {
            severity = "CRITICAL";
            reason = "streak_count = 0";
        } else if (coord.streak_count <= 2) {
            severity = "WARNING";
            reason = "streak_count low";
        } else if (coord.streak_count <= 4) {
            severity = "INFO";
            reason = "streak_count moderate";
        }

        // Gamification pausada
        if (coord.gamification_paused) {
            severity = "INFO";
            reason = "Gamification paused";
        }

        // Métricas adicionales (ejemplo: GPS)
        if (coord.metrics_json && coord.metrics_json.gps_verified === false) {
            severity = severity === "CRITICAL" ? "CRITICAL" : "WARNING";
            reason = "GPS not verified";
        }

        return {
            coordinator_id: coord.coordinator_id,
            severity,
            reason,
            last_evaluation_at: coord.last_evaluation_at,
        };
    });
}

/**
 * Opcional: obtener histórico completo de métricas de un coordinador
 * (puede implementarse luego según necesidad)
 */
// export async function getCoordinatorAuditTrail(coordinator_id: string): Promise<any[]> {
//   // Implementación futura: traer métricas y eventos históricos
// }
