// Tipos de riesgo para caminatas

import { Severity } from "./coordinador";

export interface RiskState {
    walk_id: string;
    severity: Severity;
    reason: string;
    last_evaluation_at: string;
}
