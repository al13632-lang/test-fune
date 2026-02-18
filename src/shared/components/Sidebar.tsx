'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Users,
    Calendar,
    FileText,
    Package,
    Heart,
    BarChart3,
    Settings,
    ShieldCheck,
    Building2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Profile } from '@/types/database'

interface SidebarProps {
    profile: Profile
}

export function Sidebar({ profile }: SidebarProps) {
    const pathname = usePathname()
    const isSuperAdmin = profile.role === 'super_admin'

    const navigation = isSuperAdmin ? [
        { name: 'Dashboard Global', href: '/super-admin', icon: LayoutDashboard },
        { name: 'Organizaciones', href: '/super-admin/organizations', icon: Building2 },
        { name: 'Métricas', href: '/super-admin/metrics', icon: BarChart3 },
        { name: 'Seguridad', href: '/super-admin/security', icon: ShieldCheck },
    ] : [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Familias', href: '/families', icon: Users },
        { name: 'Calendario', href: '/calendar', icon: Calendar },
        { name: 'Contratos', href: '/contracts', icon: FileText },
        { name: 'Inventario', href: '/inventory', icon: Package },
        { name: 'Memoriales', href: '/memorials', icon: Heart },
        { name: 'Finanzas', href: '/finances', icon: BarChart3 },
    ]

    // const orgColor = profile.organization?.primary_color || '#1e293b'

    return (
        <>
            {/* Mobile Toggle Placeholder - Sería modal en producción */}
            <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900 text-white z-40 hidden md:flex flex-col border-r border-white/10">
                <div className="p-6">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center font-bold text-xl">
                            F
                        </div>
                        <span className="font-bold text-lg tracking-tight">FuneralSync</span>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition group",
                                    isActive
                                        ? "bg-white/10 text-white"
                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <item.icon className={cn(
                                    "size-5 transition",
                                    isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                                )} />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <Link
                        href="/settings"
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition",
                            pathname === '/settings' && "bg-white/10 text-white"
                        )}
                    >
                        <Settings className="size-5" />
                        Configuración
                    </Link>
                </div>
            </aside>
        </>
    )
}
