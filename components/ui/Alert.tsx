import React from 'react';
import { Badge } from './Badge';

type Severity = "OK" | "INFO" | "WARNING" | "CRITICAL" | "BLOCKER";

interface AlertProps {
    title: string;
    description?: string;
    severity?: Severity;
}

export function Alert({ title, description, severity = "INFO" }: AlertProps) {
    return (
        <div className={`p-4 mb-4 rounded-md border-l-4 ${severity === "CRITICAL" || severity === "BLOCKER" ? 'bg-red-50 border-red-500' :
                severity === "WARNING" ? 'bg-yellow-50 border-yellow-500' :
                    severity === "OK" ? 'bg-green-50 border-green-500' :
                        'bg-blue-50 border-blue-500'
            }`}>
            <div className="flex justify-between">
                <h3 className="text-sm font-medium text-gray-900">{title}</h3>
                <Badge severity={severity} />
            </div>
            {description && (
                <div className="mt-1 text-sm text-gray-700">
                    {description}
                </div>
            )}
        </div>
    );
}
