'use client'

import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface KPICardProps {
    title: string
    value: string | number
    icon: LucideIcon
    description?: string
    trend?: {
        value: number
        label: string
        isUp: boolean
    }
    color?: 'blue' | 'slate' | 'emerald' | 'amber' | 'red'
}

export function KPICard({
    title,
    value,
    icon: Icon,
    description,
    trend,
    color = 'slate'
}: KPICardProps) {
    const colorMap = {
        blue: 'bg-blue-50 text-blue-600',
        slate: 'bg-slate-50 text-slate-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        amber: 'bg-amber-50 text-amber-600',
        red: 'bg-red-50 text-red-600'
    }

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div className={cn("p-2 rounded-lg", colorMap[color])}>
                    <Icon size={24} />
                </div>
                {trend && (
                    <div className={cn(
                        "text-xs font-medium px-2 py-1 rounded-full",
                        trend.isUp ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                    )}>
                        {trend.isUp ? '+' : ''}{trend.value}% {trend.label}
                    </div>
                )}
            </div>

            <div>
                <h3 className="text-sm font-medium text-slate-500 mb-1">{title}</h3>
                <p className="text-2xl font-bold text-slate-900 leading-none">{value}</p>
                {description && (
                    <p className="mt-2 text-xs text-slate-400">{description}</p>
                )}
            </div>
        </div>
    )
}
