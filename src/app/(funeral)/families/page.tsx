import { createClient } from '@/lib/supabase/server'
import { DataTable } from '@/shared/components'
import { Plus, Search } from 'lucide-react'
import type { Family } from '@/types/database'

export default async function FamiliesPage() {
    const supabase = await createClient()

    const { data: families } = await supabase
        .from('families')
        .select('*')
        .order('created_at', { ascending: false })

    const columns = [
        { header: 'Nombre', accessor: (item: Family) => `${item.first_name} ${item.last_name}` },
        { header: 'Email', accessor: 'email' as const },
        { header: 'Teléfono', accessor: 'phone' as const },
        { header: 'Relación', accessor: 'relationship' as const },
        { header: 'Registro', accessor: (item: Family) => new Date(item.created_at).toLocaleDateString() },
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Familias</h1>
                    <p className="text-slate-500">Gestión de clientes y dolientes</p>
                </div>
                <button className="bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-700 transition font-medium">
                    <Plus size={20} />
                    Nueva Familia
                </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4 shadow-sm">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, email o teléfono..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-slate-500 transition"
                    />
                </div>
            </div>

            <DataTable
                columns={columns}
                data={families || []}
                emptyMessage="No se encontraron familias registradas."
            />
        </div>
    )
}
