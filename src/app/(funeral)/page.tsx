import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { KPICard, DataTable, StatusBadge } from '@/shared/components'
import { Users, Calendar, Receipt, TrendingUp } from 'lucide-react'
import type { Family } from '@/types/database'

export default async function FuneralDashboard() {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    const user = data?.user

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()

    if (profile?.role === 'super_admin') {
        redirect('/super-admin')
    }

    const stats = [
        { title: 'Familias', value: '12', icon: Users, color: 'blue' as const },
        { title: 'Ceremonias Hoy', value: '2', icon: Calendar, color: 'emerald' as const },
        { title: 'Ingresos Mes', value: '$45,200', icon: Receipt, color: 'amber' as const },
        { title: 'Ocupación', value: '85%', icon: TrendingUp, color: 'slate' as const },
    ]

    const recentFamilies: Family[] = [
        {
            id: '1',
            organization_id: 'demo-org',
            first_name: 'Juan',
            last_name: 'Pérez',
            phone: '55 1234 5678',
            email: 'juan@example.com',
            address: null,
            relationship: 'Hijo',
            notes: null,
            created_at: new Date().toISOString()
        },
        {
            id: '2',
            organization_id: 'demo-org',
            first_name: 'María',
            last_name: 'García',
            phone: '55 8765 4321',
            email: 'maria@example.com',
            address: null,
            relationship: 'Esposa',
            notes: null,
            created_at: new Date().toISOString()
        },
    ]

    const columns = [
        { header: 'Nombre', accessor: (item: Family) => `${item.first_name} ${item.last_name}` },
        { header: 'Teléfono', accessor: 'phone' as const },
        { header: 'Fecha Registro', accessor: (item: Family) => new Date(item.created_at).toLocaleDateString() },
    ]

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-500">Gestión diaria de tu funeraria</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <KPICard key={idx} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-slate-800">Próximas Ceremonias</h2>
                        <button className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">
                            Ver calendario
                        </button>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 text-sm shadow-sm">
                        No hay ceremonias programadas para hoy.
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-slate-800">Nuevas Familias</h2>
                        <button className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">
                            Ver todas
                        </button>
                    </div>
                    <DataTable
                        columns={columns.slice(0, 2)}
                        data={recentFamilies}
                        emptyMessage="No hay familias registradas."
                    />
                </div>
            </div>
        </div>
    )
}
