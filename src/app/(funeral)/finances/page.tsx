import { KPICard, DataTable } from '@/shared/components'
import { DollarSign, CreditCard, Wallet, TrendingUp } from 'lucide-react'

export default function FinancesPage() {
    const stats = [
        { title: 'Ingresos Hoy', value: '$2,400', icon: DollarSign, color: 'emerald' as const },
        { title: 'Ingresos Semana', value: '$15,800', icon: Wallet, color: 'blue' as const },
        { title: 'Ingresos Mes', value: '$45,200', icon: TrendingUp, color: 'amber' as const },
    ]

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Finanzas</h1>
                <p className="text-slate-500">Reportes de ingresos y estados de pago</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                    <KPICard key={idx} {...stat} />
                ))}
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-8 min-h-[400px] flex items-center justify-center text-slate-400 italic shadow-sm">
                Gráficas de ingresos en desarrollo...
            </div>
        </div>
    )
}
