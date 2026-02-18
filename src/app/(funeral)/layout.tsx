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

    const { data: profile } = await supabase
        .from('profiles')
        .select('*, organization:organizations(*)')
        .eq('id', user.id)
        .maybeSingle()

    if (!profile) redirect('/login')

    // Super admin no debería estar aquí si hay un layout dedicado
    if (profile.role === 'super_admin') {
        // No redireccionamos aquí para permitir que super-admin vea dashboards de orgs si es necesario, 
        // pero el sidebar ya cambia según rol.
    } else if (!profile.organization_id) {
        throw new Error('Usuario sin organización asignada')
    }

    return <AppLayout>{children}</AppLayout>
}
