export async function sendWhatsApp(to: string, message: string) {
    console.log(`[WhatsApp] Sending to ${to}: ${message}`)
    return { success: true }
}

export async function sendSMS(to: string, message: string) {
    console.log(`[SMS] Sending to ${to}: ${message}`)
    return { success: true }
}
