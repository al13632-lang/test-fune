import { createClient } from '@/lib/supabase/server'

export default async function TestPage() {
    let status = "Iniciando diagnóstico..."
    let envVars = {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Configurada (OK)" : "FALTA",
        key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Configurada (OK)" : "FALTA"
    }
    let userResult = "No intentado"

    try {
        const supabase = await createClient()
        const { data, error } = await supabase.auth.getUser()
        if (error) {
            userResult = `Error de Supabase Auth: ${error.message}`
        } else {
            userResult = `Usuario detectado: ${data.user?.email || "No hay sesión activa"}`
        }
    } catch (e: any) {
        userResult = `CRASH CRÍTICO: ${e.message}`
    }

    return (
        <div className="p-20 space-y-6">
            <h1 className="text-4xl font-bold">Diagnóstico de Supabase</h1>

            <div className="bg-slate-50 p-6 rounded-xl border">
                <h2 className="font-semibold mb-2">Variables de Entorno:</h2>
                <pre className="text-sm">{JSON.stringify(envVars, null, 2)}</pre>
            </div>

            <div className={`p-6 rounded-xl border ${userResult.includes('CRASH') ? 'bg-red-50' : 'bg-emerald-50'}`}>
                <h2 className="font-semibold mb-2">Resultado de Auth:</h2>
                <p>{userResult}</p>
            </div>

            <p className="text-slate-500 text-sm italic">
                Este diagnóstico nos dirá exactamente por qué falla la conexión con Supabase en Vercel.
            </p>
        </div>
    )
}
