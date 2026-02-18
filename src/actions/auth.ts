'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const orgCode = formData.get('org_code') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // Super-admin login (sin org_code)
    if (email === 'admin@funeralsync.com') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) return { error: error.message }

        revalidatePath('/', 'layout')
        redirect('/super-admin')
    }

    // Funeraria login (con org_code)
    if (!orgCode) return { error: 'Código de organización requerido' }

    // Verificar que la organización existe y está activa
    const { data: org } = await supabase
        .from('organizations')
        .select('id, is_active')
        .eq('org_code', orgCode.toLowerCase())
        .maybeSingle()

    if (!org) return { error: 'Organización no encontrada' }
    if (!org.is_active) return { error: 'Organización inactiva' }

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }

    // Verificar que el usuario pertenece a la organización
    const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('email', email)
        .maybeSingle()

    if (profile?.organization_id !== org.id) {
        await supabase.auth.signOut()
        return { error: 'Usuario no pertenece a esta organización' }
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('full_name') as string

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { full_name: fullName }
        }
    })

    if (error) return { error: error.message }

    revalidatePath('/', 'layout')
    redirect('/check-email')
}

export async function signout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/login')
}

export async function resetPassword(formData: FormData) {
    const supabase = await createClient()
    const email = formData.get('email') as string

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/update-password`,
    })

    if (error) return { error: error.message }

    return { success: 'Revisa tu correo para restablecer tu contraseña' }
}

export async function updatePassword(formData: FormData) {
    const supabase = await createClient()
    const password = formData.get('password') as string

    const { error } = await supabase.auth.updateUser({ password })

    if (error) return { error: error.message }

    revalidatePath('/', 'layout')
    redirect('/')
}
