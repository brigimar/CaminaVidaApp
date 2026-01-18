export type Severity = "OK" | "INFO" | "WARNING" | "CRITICAL" | "BLOCKER";

export interface RiskState {
    coordinator_id: string;
    severity: Severity;
    reason: string;
    last_evaluation_at: string;
}

export interface CoordinatorSkill {
    coordinator_id: string;
    skill_name: string;
    rating: number;
    last_updated_at?: string;
}

export interface CoordinadoresBio {
    coordinator_id: string;
    foto_url?: string;
    motivacion_json?: any;
    tiempo_acompanando?: string;
    formacion_json?: any;
}
