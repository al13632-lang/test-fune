import { createClient } from '@/lib/supabase/server'
import { Plus, Package, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

export default async function InventoryPage() {
    const supabase = await createClient()

    const { data: items } = await supabase
        .from('inventory_items')
        .select('*')
        .order('name', { ascending: true })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Inventario</h1>
                    <p className="text-slate-500">Control de ataúdes, urnas y accesorios</p>
                </div>
                <button className="bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-700 transition font-medium">
                    <Plus size={20} />
                    Nuevo Producto
                </button>
            </div>

            {!items || items.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500 shadow-sm">
                    No hay productos en el inventario.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {items.map((item) => (
                        <div key={item.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                            <div className="aspect-square bg-slate-100 flex items-center justify-center text-slate-300">
                                {item.image_url ? (
                                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                    <Package size={48} />
                                )}
                            </div>
                            <div className="p-4 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{item.category}</span>
                                    {item.stock <= 2 && (
                                        <span className="text-red-500 flex items-center gap-1 text-xs">
                                            <AlertTriangle size={12} />
                                            Bajo stock
                                        </span>
                                    )}
                                </div>
                                <h3 className="font-semibold text-slate-900">{item.name}</h3>
                                <div className="flex items-center justify-between pt-2">
                                    <p className="text-slate-600 font-medium">${item.price.toLocaleString()}</p>
                                    <p className={cn(
                                        "text-sm px-2 py-0.5 rounded-lg border",
                                        item.stock > 0 ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-700 border-red-100"
                                    )}>
                                        Stock: {item.stock}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
