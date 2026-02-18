export interface Profile {
    id: string
    email: string
    full_name: string | null
    avatar_url: string | null
    role: 'super_admin' | 'owner' | 'employee' | 'readonly'
    organization_id: string | null
    created_at: string
    updated_at: string
    organization?: Organization | null // Relación unida
}

export interface Organization {
    id: string
    name: string
    org_code: string
    logo_url: string | null
    primary_color: string
    secondary_color: string
    custom_text: Record<string, string> | null
    is_active: boolean
    created_at: string
    updated_at: string
}

export interface Family {
    id: string
    organization_id: string
    first_name: string
    last_name: string
    email: string | null
    phone: string
    address: string | null
    relationship: string
    notes: string | null
    created_at: string
}

export interface Service {
    id: string
    organization_id: string
    name: string
    description: string | null
    price: number
    duration_minutes: number
    category: 'velatorio' | 'cremacion' | 'entierro' | 'paquete'
    is_active: boolean
    created_at: string
}

export interface Ceremony {
    id: string
    organization_id: string
    family_id: string
    service_id: string
    deceased_name: string
    deceased_birth_date: string
    deceased_death_date: string
    start_time: string
    end_time: string
    status: 'programada' | 'en_proceso' | 'completada' | 'cancelada'
    location: string | null
    notes: string | null
    created_at: string
}

export interface Contract {
    id: string
    ceremony_id: string
    organization_id: string
    total_amount: number
    paid_amount: number
    pending_amount: number
    contract_pdf_url: string | null
    status: 'borrador' | 'firmado' | 'pagado' | 'cancelado'
    created_at: string
    ceremonies?: Ceremony | null // Relación unida
}

export interface Payment {
    id: string
    contract_id: string
    organization_id: string
    amount: number
    payment_method: string
    payment_date: string
    notes: string | null
    created_at: string
}

export interface InventoryItem {
    id: string
    organization_id: string
    name: string
    category: 'ataud' | 'urna' | 'flores' | 'accesorio'
    stock: number
    price: number
    description: string | null
    image_url: string | null
    created_at: string
}

export interface Memorial {
    id: string
    ceremony_id: string
    organization_id: string
    slug: string
    obituary_text: string
    photo_gallery: string[]
    is_public: boolean
    created_at: string
    ceremonies?: Ceremony | null
    organizations?: Organization | null
}

export interface Condolence {
    id: string
    memorial_id: string
    author_name: string
    author_email: string | null
    message: string
    is_approved: boolean
    created_at: string
}
