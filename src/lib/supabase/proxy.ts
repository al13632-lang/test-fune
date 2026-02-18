import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Si faltan las variables, no podemos validar sesión, pero no queremos que la app explote
    if (!supabaseUrl || !supabaseAnonKey) {
        return NextResponse.next({ request })
    }

    let supabaseResponse = NextResponse.next({ request })

    try {
        const supabase = createServerClient(
            supabaseUrl,
            supabaseAnonKey,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll()
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                        supabaseResponse = NextResponse.next({
                            request,
                        })
                        cookiesToSet.forEach(({ name, value, options }) =>
                            supabaseResponse.cookies.set(name, value, options)
                        )
                    },
                },
            }
        )

        // IMPORTANTE: Un error aquí suele ser por falta de conectividad o JWT inválido
        const { data } = await supabase.auth.getUser()
        const user = data?.user

        const authRoutes = ['/login', '/signup', '/forgot-password', '/update-password', '/check-email']
        const publicRoutes = ['/memorial', '/favicon.ico', '/favicon.svg', '/api']

        const path = request.nextUrl.pathname
        const isAuthRoute = authRoutes.some(route => path.startsWith(route))
        const isPublicRoute = publicRoutes.some(route => path.startsWith(route))

        // Si es / no redirigir a login, permitir que la página maneje su lógica o el middleware redirija
        if (!user && !isAuthRoute && !isPublicRoute && path !== '/') {
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }

        if (user && isAuthRoute) {
            const url = request.nextUrl.clone()
            url.pathname = '/'
            return NextResponse.redirect(url)
        }

        return supabaseResponse
    } catch (error) {
        return NextResponse.next({ request })
    }
}
