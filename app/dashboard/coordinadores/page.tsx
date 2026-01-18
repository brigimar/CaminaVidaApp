import { getCoordinatorsHealthSummary, getCoordinatorsWithActiveRisk } from '@/lib/queries/coordinadores';
import { Metric } from '@/components/ui/Metric';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';

export const dynamic = 'force-dynamic';

export default async function CoordinadoresPage() {
    const [summary, risks] = await Promise.all([
        getCoordinatorsHealthSummary(),
        getCoordinatorsWithActiveRisk(),
    ]);

    const columns = [
        { header: 'ID', accessor: (row: any) => row.coordinator_id.slice(0, 8) + '...', className: 'font-mono' },
        { header: 'Severity', accessor: (row: any) => <Badge severity={row.severity} /> },
        { header: 'Reason', accessor: (row: any) => row.reason },
        { header: 'Last Evaluated', accessor: (row: any) => new Date(row.last_evaluation_at).toLocaleString() },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <Metric title="OK" value={summary.OK} className="border-l-4 border-green-500" />
                <Metric title="INFO" value={summary.INFO} className="border-l-4 border-blue-500" />
                <Metric title="WARNING" value={summary.WARNING} className="border-l-4 border-yellow-500" />
                <Metric title="CRITICAL" value={summary.CRITICAL} className="border-l-4 border-red-500" />
            </div>

            <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Coordinadores en Riesgo</h2>
                {risks.length === 0 ? (
                    <Alert title="Todo en orden" description="No hay coordinadores con riesgo activo." severity="OK" />
                ) : (
                    <Table
                        data={risks}
                        columns={columns}
                        keyExtractor={(row) => row.coordinator_id}
                    />
                )}
            </div>
        </div>
    );
}
