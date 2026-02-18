import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/shared/components/Sidebar'
import { Header } from '@/shared/components/Header'

export async function AppLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    const user = data?.user

    if (!user) redirect('/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('*, organization:organizations(*)')
        .eq('id', user.id)
        .maybeSingle()

    if (!profile) redirect('/login')

    // Redirección especial si es super-admin y no está en la ruta correcta
    // Nota: window.location no está disponible en Server Components, se manejará por middleware o props de ruta

    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar profile={profile} />
            <div className="md:ml-64">
                <Header profile={profile} />
                <main className="p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
