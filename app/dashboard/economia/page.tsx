import { getEconomicRisks } from '@/lib/queries/economia';
import { Metric } from '@/components/ui/Metric';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';

export const dynamic = 'force-dynamic';

export default async function EconomiaPage() {
    const risks = await getEconomicRisks();

    const criticals = risks.filter(r => r.severity === 'CRITICAL' || r.severity === 'BLOCKER');
    const warnings = risks.filter(r => r.severity === 'WARNING');

    const columns = [
        { header: 'Event ID', accessor: (row: any) => row.event_id, className: 'font-mono' },
        { header: 'Severity', accessor: (row: any) => <Badge severity={row.severity} /> },
        { header: 'Reason', accessor: (row: any) => row.reason },
        { header: 'Timestamp', accessor: (row: any) => new Date(row.last_evaluation_at).toLocaleString() },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <Metric title="Total Analyzed" value={risks.length} />
                <Metric title="Critical / Blocker" value={criticals.length} className={criticals.length > 0 ? "text-red-600" : ""} />
                <Metric title="Warnings" value={warnings.length} className={warnings.length > 0 ? "text-yellow-600" : ""} />
            </div>

            <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Integridad del Ledger</h2>
                <Table
                    data={risks.filter(r => r.severity !== 'OK')}
                    columns={columns}
                    keyExtractor={(row) => row.event_id}
                />
            </div>
        </div>
    );
}
