import React from 'react';

interface MetricProps {
    title: string;
    value: string | number;
    description?: string;
    className?: string;
}

export function Metric({ title, value, description, className = "" }: MetricProps) {
    return (
        <div className={`bg-white overflow-hidden shadow rounded-lg px-4 py-5 sm:p-6 ${className}`}>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{value}</dd>
            {description && <dd className="mt-1 text-sm text-gray-600">{description}</dd>}
        </div>
    );
}
