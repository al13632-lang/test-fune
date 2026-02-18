import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { KPICard, DataTable, StatusBadge } from '@/shared/components'
import { Building2, Users, Receipt, CalendarCheck } from 'lucide-react'
import type { Organization } from '@/types/database'

export default async function SuperAdminDashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()

    if (profile?.role !== 'super_admin') {
        redirect('/')
    }

    // En producción estas queries tendrían agregaciones reales
    const { data: orgs } = await supabase
        .from('organizations')
        .select('*, profiles(count)')
        .order('created_at', { ascending: false })

    const stats = [
        { title: 'Organizaciones', value: orgs?.length || 0, icon: Building2, color: 'blue' as const },
        { title: 'Ceremonias Mes', value: '42', icon: CalendarCheck, color: 'emerald' as const },
        { title: 'Ingresos Globales', value: '$124,500', icon: Receipt, color: 'amber' as const },
        { title: 'Usuarios Totales', value: '156', icon: Users, color: 'slate' as const },
    ]

    const columns = [
        { header: 'Organización', accessor: 'name' as const },
        { header: 'Código', accessor: 'org_code' as const, className: 'font-mono text-xs uppercase' },
        { header: 'Estado', accessor: (item: Organization) => <StatusBadge status={item.is_active ? 'activo' : 'inactivo'} /> },
        { header: 'Creado', accessor: (item: Organization) => new Date(item.created_at).toLocaleDateString() },
    ]

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Panel Super-Admin</h1>
                <p className="text-slate-500">Vista global de la plataforma FuneralSync Pro</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <KPICard key={idx} {...stat} />
                ))}
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-800">Organizaciones Recientes</h2>
                    <button className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">
                        Ver todas
                    </button>
                </div>

                <DataTable
                    columns={columns}
                    data={orgs || []}
                    emptyMessage="No hay organizaciones registradas."
                />
            </div>
        </div>
    )
}
