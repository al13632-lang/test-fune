import { createClient } from '@/lib/supabase/server'
import { DataTable, StatusBadge } from '@/shared/components'
import { Plus, Search, FileText } from 'lucide-react'
import type { Contract } from '@/types/database'

export default async function ContractsPage() {
    const supabase = await createClient()

    const { data: contracts } = await supabase
        .from('contracts')
        .select('*, ceremonies(deceased_name)')
        .order('created_at', { ascending: false })

    const columns = [
        { header: 'Difunto', accessor: (item: Contract) => item.ceremonies?.deceased_name || 'N/A' },
        { header: 'Total', accessor: (item: Contract) => `$${item.total_amount.toLocaleString()}` },
        { header: 'Pagado', accessor: (item: Contract) => `$${item.paid_amount.toLocaleString()}` },
        { header: 'Pendiente', accessor: (item: Contract) => `$${item.pending_amount.toLocaleString()}`, className: 'text-red-600 font-medium' },
        { header: 'Estado', accessor: (item: Contract) => <StatusBadge status={item.status} /> },
        { header: 'Fecha', accessor: (item: Contract) => new Date(item.created_at).toLocaleDateString() },
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Contratos</h1>
                    <p className="text-slate-500">Gestión de acuerdos y estados de cuenta</p>
                </div>
                <button className="bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-700 transition font-medium">
                    <FileText size={20} />
                    Nuevo Contrato
                </button>
            </div>

            <DataTable
                columns={columns}
                data={contracts || []}
                emptyMessage="No se encontraron contratos registrados."
            />
        </div>
    )
}
