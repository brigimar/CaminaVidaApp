// Tipos de riesgo para coordinadores

export type Severity = "OK" | "INFO" | "WARNING" | "CRITICAL" | "BLOCKER";

export interface RiskState {
    coordinator_id: string;
    severity: Severity;
    reason: string;
    last_evaluation_at: string;
}
