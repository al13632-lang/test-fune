import type { Profile } from '@/types/database'

export function canAccessFinances(profile: Profile): boolean {
    return profile.role === 'super_admin' || profile.role === 'owner'
}

export function canEditOrganization(profile: Profile): boolean {
    return profile.role === 'super_admin' || profile.role === 'owner'
}

export function canDeleteData(profile: Profile): boolean {
    return profile.role !== 'readonly'
}

export function canCreateData(profile: Profile): boolean {
    return profile.role !== 'readonly'
}
