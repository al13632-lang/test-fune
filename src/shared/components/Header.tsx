'use client'

import { signout } from '@/actions/auth'
import { LogOut, User, Bell } from 'lucide-react'
import type { Profile } from '@/types/database'

interface HeaderProps {
    profile: Profile
}

export function Header({ profile }: HeaderProps) {
    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-slate-800 hidden md:block">
                    {profile.organization?.name || 'FuneralSync Pro'}
                </h2>
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition">
                    <Bell size={20} />
                </button>

                <div className="h-8 w-px bg-slate-200 mx-1"></div>

                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-slate-900">{profile.full_name}</p>
                        <p className="text-xs text-slate-500 capitalize">{profile.role.replace('_', ' ')}</p>
                    </div>

                    <div className="group relative">
                        <button className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 border border-slate-200 overflow-hidden">
                            {profile.avatar_url ? (
                                <img src={profile.avatar_url} alt={profile.full_name || ''} className="w-full h-full object-cover" />
                            ) : (
                                <User size={20} />
                            )}
                        </button>

                        <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1 hidden group-hover:block animate-in fade-in zoom-in duration-75">
                            <button
                                onClick={() => signout()}
                                className="w-full h-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition"
                            >
                                <LogOut size={16} />
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
