import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Heart, MessageSquare, Camera } from 'lucide-react'

export default async function MemorialPage({ params }: { params: { slug: string } }) {
    const supabase = await createClient()

    const { data: memorial } = await supabase
        .from('memorials')
        .select('*, ceremonies(*), organizations(*)')
        .eq('slug', params.slug)
        .single()

    if (!memorial) notFound()

    return (
        <div className="min-h-screen bg-slate-50 font-serif">
            {/* Hero / Header */}
            <header className="bg-slate-900 text-white py-20 px-6 text-center bg-[url('https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80')] bg-cover bg-center bg-blend-overlay">
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="w-40 h-40 rounded-full border-4 border-white mx-auto overflow-hidden shadow-2xl bg-slate-800 flex items-center justify-center">
                        <Camera className="text-white/20" size={48} />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{memorial.ceremonies?.deceased_name}</h1>
                        <p className="text-lg text-slate-300">
                            {new Date(memorial.ceremonies?.deceased_birth_date).getFullYear()} — {new Date(memorial.ceremonies?.deceased_death_date).getFullYear()}
                        </p>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto py-16 px-6 space-y-20">
                {/* Obituary */}
                <section className="space-y-8">
                    <div className="flex items-center justify-center gap-2 text-slate-400">
                        <div className="h-px w-12 bg-slate-200"></div>
                        <Heart size={16} />
                        <div className="h-px w-12 bg-slate-200"></div>
                    </div>
                    <div className="prose prose-slate prose-lg mx-auto text-slate-700 leading-relaxed text-center whitespace-pre-wrap italic">
                        {memorial.obituary_text}
                    </div>
                </section>

                {/* Gallery */}
                <section className="space-y-8">
                    <h2 className="text-2xl font-bold text-center text-slate-900 font-sans">Galería de Recuerdos</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="aspect-square bg-slate-200 rounded-xl overflow-hidden shadow-sm hover:scale-[1.02] transition duration-300">
                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                    <Camera size={32} />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Condolences */}
                <section className="space-y-8">
                    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm font-sans">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <MessageSquare size={24} className="text-slate-400" />
                            Expresar Condolencias
                        </h2>
                        <form className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Tu nombre completo"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 transition"
                                    required
                                />
                                <input
                                    type="email"
                                    placeholder="Tu correo (opcional)"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 transition"
                                />
                            </div>
                            <textarea
                                rows={4}
                                placeholder="Escribe un mensaje de apoyo para la familia..."
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 transition"
                                required
                            ></textarea>
                            <button className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg">
                                Enviar Mensaje
                            </button>
                        </form>
                    </div>
                </section>
            </main>

            <footer className="bg-white border-t border-slate-200 py-12 px-6 text-center font-sans">
                <div className="max-w-4xl mx-auto space-y-4">
                    <p className="text-sm text-slate-400 uppercase tracking-widest">Un servicio de</p>
                    <p className="text-lg font-bold text-slate-800">{memorial.organizations?.name}</p>
                    <div className="h-10"></div>
                    <p className="text-xs text-slate-300">FuneralSync Pro &copy; {new Date().getFullYear()}</p>
                </div>
            </footer>
        </div>
    )
}
