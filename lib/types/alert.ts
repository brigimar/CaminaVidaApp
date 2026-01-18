// Tipo genérico para alertas consolidadas

import { Severity } from "./coordinador";

export interface RiskState {
    id?: string; // puede ser walk, coordinator o event
    severity: Severity;
    reason: string;
    last_evaluation_at: string;
}
