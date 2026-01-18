// Tipos de riesgo para economía / ledger

import { Severity } from "./coordinador";

export interface RiskState {
    event_id: number | string;
    severity: Severity;
    reason: string;
    last_evaluation_at: string;
}
