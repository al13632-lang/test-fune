'use client'

import { cn } from '@/lib/utils'

interface Column<T> {
    header: string
    accessor: keyof T | ((item: T) => React.ReactNode)
    className?: string
}

interface DataTableProps<T> {
    columns: Column<T>[]
    data: T[]
    onRowClick?: (item: T) => void
    emptyMessage?: string
}

export function DataTable<T extends { id: string | number }>({
    columns,
    data,
    onRowClick,
    emptyMessage = 'No se encontraron registros.'
}: DataTableProps<T>) {
    if (data.length === 0) {
        return (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500 text-sm shadow-sm">
                {emptyMessage}
            </div>
        )
    }

    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                            {columns.map((column, idx) => (
                                <th key={idx} className={cn("px-6 py-4 whitespace-nowrap", column.className)}>
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.map((item) => (
                            <tr
                                key={item.id}
                                onClick={() => onRowClick?.(item)}
                                className={cn(
                                    "hover:bg-slate-50 transition-colors group",
                                    onRowClick && "cursor-pointer"
                                )}
                            >
                                {columns.map((column, idx) => (
                                    <td key={idx} className={cn("px-6 py-4 whitespace-nowrap text-slate-600", column.className)}>
                                        {typeof column.accessor === 'function'
                                            ? column.accessor(item)
                                            : (item[column.accessor] as React.ReactNode)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
