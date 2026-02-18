'use client'

import { cn } from '@/lib/utils'

type StatusType = 'programada' | 'en_proceso' | 'completada' | 'cancelada' | 'borrador' | 'firmado' | 'pagado' | 'activo' | 'inactivo'

interface StatusBadgeProps {
    status: StatusType | string
    className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
    const s = status.toLowerCase()

    const variants: Record<string, string> = {
        programada: 'bg-amber-50 text-amber-700 border-amber-100',
        en_proceso: 'bg-blue-50 text-blue-700 border-blue-100',
        completada: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        cancelada: 'bg-red-50 text-red-700 border-red-100',
        borrador: 'bg-slate-50 text-slate-700 border-slate-100',
        firmado: 'bg-indigo-50 text-indigo-700 border-indigo-100',
        pagado: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        activo: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        inactivo: 'bg-red-50 text-red-700 border-red-100',
    }

    return (
        <span className={cn(
            "px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize",
            variants[s] || "bg-slate-50 text-slate-700 border-slate-100",
            className
        )}>
            {s.replace('_', ' ')}
        </span>
    )
}
