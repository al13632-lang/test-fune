import { Calendar as CalendarIcon, Filter, List } from 'lucide-react'

export default function CalendarPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Calendario</h1>
                    <p className="text-slate-500">Programación de ceremonias y servicios</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-white border border-slate-200 p-2 rounded-lg text-slate-600 hover:bg-slate-50 transition">
                        <List size={20} />
                    </button>
                    <button className="bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-700 transition font-medium">
                        <CalendarIcon size={20} />
                        Nueva Ceremonia
                    </button>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 min-h-[600px] flex items-center justify-center text-slate-400 italic shadow-sm">
                Integración de calendario en progreso...
            </div>
        </div>
    )
}
