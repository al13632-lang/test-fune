import { LoginForm } from '@/features/auth/components'

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Panel izquierdo - Desktop only */}
            <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-slate-800 to-slate-900 text-white flex-col justify-center items-center p-12">
                <div className="max-w-md text-center space-y-6">
                    <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto">
                        <span className="text-4xl font-bold">F</span>
                    </div>
                    <h1 className="text-4xl font-bold">FuneralSync Pro</h1>
                    <p className="text-lg text-slate-300">
                        Plataforma completa para la gestión de funerarias
                    </p>
                    <div className="space-y-2 text-sm text-slate-400">
                        <p>✓ Gestión de familias y ceremonias</p>
                        <p>✓ Control de inventario y pagos</p>
                        <p>✓ Páginas conmemorativas públicas</p>
                    </div>
                </div>
            </div>

            {/* Panel derecho - Formulario */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8">
                <LoginForm />
            </div>
        </div>
    )
}
