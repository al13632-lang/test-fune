import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AppLayout } from '@/shared/components'

export default async function FuneralLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    const user = data?.user

    if (!user) redirect('/login')

    if (!profile) {
        redirect('/login')
    }

    // Super admin no debería estar aquí si hay un layout dedicado
    if (profile.role === 'super_admin') {
        // Permitir
    } else if (!profile.organization_id) {
        // En lugar de arrojar error que rompe Vercel, redirigimos
        redirect('/login')
    }

    return <AppLayout>{children}</AppLayout>
}
