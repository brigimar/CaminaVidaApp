import React from 'react';

type Severity = "OK" | "INFO" | "WARNING" | "CRITICAL" | "BLOCKER";

const severityColors: Record<Severity, string> = {
    OK: "bg-green-100 text-green-800",
    INFO: "bg-blue-100 text-blue-800",
    WARNING: "bg-yellow-100 text-yellow-800",
    CRITICAL: "bg-red-100 text-red-800",
    BLOCKER: "bg-purple-100 text-purple-800",
};

interface BadgeProps {
    severity: Severity;
    label?: string;
}

export function Badge({ severity, label }: BadgeProps) {
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${severityColors[severity]}`}>
            {label || severity}
        </span>
    );
}
