import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AppLayout } from '@/shared/components'

export default async function SuperAdminLayout({
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
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

    if (!profile || profile.role !== 'super_admin') {
        redirect('/')
    }

    return <AppLayout>{children}</AppLayout>
}
