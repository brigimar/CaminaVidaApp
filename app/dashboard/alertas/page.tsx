import { getActiveAlerts } from '@/lib/queries/alertas';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';

export const dynamic = 'force-dynamic';

export default async function AlertasPage() {
    const alerts = await getActiveAlerts();

    // Flatten keys for generic table
    const flattened = alerts.map((a: any) => ({
        id: a.coordinator_id || a.walk_id || a.event_id || 'unknown',
        ...a
    }));

    const columns = [
        { header: 'Ref ID', accessor: (row: any) => String(row.id).slice(0, 15) + '...', className: 'font-mono' },
        { header: 'Severity', accessor: (row: any) => <Badge severity={row.severity} /> },
        { header: 'Reason', accessor: (row: any) => row.reason },
        { header: 'Detected At', accessor: (row: any) => new Date(row.last_evaluation_at).toLocaleString() },
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Alertas Activas del Sistema</h2>
            <p className="text-gray-500">Vista consolidada de todos los dominios.</p>

            <Table
                data={flattened.filter(a => a.severity !== 'OK')}
                columns={columns}
                keyExtractor={(row) => row.id + row.reason}
            />
        </div>
    );
}
