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
                        cookiesToSet.forEach(({ name, value, options }) => {
                            request.cookies.set(name, value)
                        })
                        supabaseResponse = NextResponse.next({ request })
                        cookiesToSet.forEach(({ name, value, options }) =>
                            supabaseResponse.cookies.set(name, value, options)
                        )
                    },
                },
            }
        )

        const { data: { user } } = await supabase.auth.getUser()

        const authRoutes = ['/login', '/signup', '/forgot-password', '/update-password', '/check-email']
        const publicRoutes = ['/memorial', '/favicon.ico', '/favicon.svg']
        const isAuthRoute = authRoutes.some(route => request.nextUrl.pathname.startsWith(route))
        const isPublicRoute = publicRoutes.some(route => request.nextUrl.pathname.startsWith(route))

        // Evitar bucles de redirección
        if (request.nextUrl.pathname === '/login' && !user) {
            return supabaseResponse
        }

        // Sin sesión + ruta protegida → redirect a login
        if (!user && !isAuthRoute && !isPublicRoute && request.nextUrl.pathname !== '/') {
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }

        // Con sesión + ruta de auth → redirect a home
        if (user && isAuthRoute) {
            return NextResponse.redirect(new URL('/', request.url))
        }

        return supabaseResponse
    } catch (error) {
        // En caso de error crítico en el middleware, permitimos que continúe para no bloquear la app
        console.error('Middleware Error:', error)
        return NextResponse.next({ request })
    }
}
