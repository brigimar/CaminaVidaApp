import { getWalksWithActiveRisk } from '@/lib/queries/caminatas';
import { Metric } from '@/components/ui/Metric';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';

export const dynamic = 'force-dynamic';

export default async function CaminatasPage() {
    const risks = await getWalksWithActiveRisk();

    const activeRisks = risks.filter(r => r.severity !== 'OK');
    const totalWalks = risks.length; // Assuming query returns all or we interpret size as sample

    const columns = [
        { header: 'ID', accessor: (row: any) => row.walk_id.slice(0, 8) + '...', className: 'font-mono' },
        { header: 'Severity', accessor: (row: any) => <Badge severity={row.severity} /> },
        { header: 'Reason', accessor: (row: any) => row.reason },
        { header: 'Last Evaluated', accessor: (row: any) => new Date(row.last_evaluation_at).toLocaleString() },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Metric title="Evaluated Walks" value={totalWalks} />
                <Metric title="Risks Detected" value={activeRisks.length} className={activeRisks.length > 0 ? "border-l-4 border-red-500" : "border-l-4 border-green-500"} />
            </div>

            <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Caminatas con Riesgo</h2>
                <Table
                    data={activeRisks}
                    columns={columns}
                    keyExtractor={(row) => row.walk_id}
                />
            </div>
        </div>
    );
}
