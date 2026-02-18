'use client'

import { useState } from 'react'
import { login } from '@/actions/auth'
import Link from 'next/link'

export function LoginForm() {
    const [error, setError] = useState<string>('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError('')
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const result = await login(formData)

        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-slate-900">Iniciar Sesión</h2>
                <p className="mt-2 text-sm text-slate-600">Accede a tu cuenta de FuneralSync</p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label htmlFor="org_code" className="block text-sm font-medium text-slate-700 mb-1">
                            Código de Organización
                        </label>
                        <input
                            id="org_code"
                            name="org_code"
                            type="text"
                            placeholder="Ej: sanjose"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none"
                        />
                        <p className="mt-1 text-xs text-slate-500">
                            Deja en blanco si eres super-admin
                        </p>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                            Correo Electrónico
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none"
                        />
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-700 text-white py-2.5 px-4 rounded-lg hover:bg-slate-800 transition font-medium disabled:opacity-50"
                    >
                        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </button>
                </div>

                <div className="text-center text-sm">
                    <Link href="/forgot-password" title="Próximamente" className="text-slate-400 cursor-not-allowed pointer-events-none">
                        ¿Olvidaste tu contraseña?
                    </Link>
                </div>
            </form>
        </div>
    )
}
