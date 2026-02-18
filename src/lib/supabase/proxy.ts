import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        return NextResponse.next({ request })
    }

    let supabaseResponse = NextResponse.next({ request })

    try {
        const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({ request })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        })

        const { data } = await supabase.auth.getUser()
        const user = data?.user
        const path = request.nextUrl.pathname

        const isAuthRoute = path.startsWith('/login') || path.startsWith('/signup') || path.startsWith('/forgot-password')
        const isPublicRoute = path.startsWith('/memorial') || path.startsWith('/favicon') || path.startsWith('/api') || path.startsWith('/_next')

        if (!user && !isAuthRoute && !isPublicRoute && path !== '/') {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        if (user && isAuthRoute) {
            return NextResponse.redirect(new URL('/', request.url))
        }

        return supabaseResponse
    } catch (e) {
        return NextResponse.next({ request })
    }
}
