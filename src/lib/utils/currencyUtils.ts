export function formatCurrency(amount: number, currencyCode: string = 'USD'): string {
    try {
        return new Intl.NumberFormat(undefined, { style: 'currency', currency: currencyCode }).format(amount);
    } catch (e) {
        // Fallback for unknown currency codes or other errors
        console.warn(`Currency formatting error for ${currencyCode}:`, e);
        return `${amount.toFixed(2)} ${currencyCode}`;
    }
}

export function formatDate(dateString: string | undefined | null): string {
    if (!dateString) return 'N/A';
    try {
        // Ensure the date is parsed as UTC to avoid timezone shifts if not already a full ISO string
        // If dateString is just 'YYYY-MM-DD', append 'T00:00:00Z' to treat it as UTC midnight.
        const ensuredUtcDate = dateString.includes('T') || dateString.includes('Z') ? dateString : `${dateString}T00:00:00Z`;
        return new Date(ensuredUtcDate).toLocaleDateString('es-ES', {
            year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC'
        });
    } catch (e) {
        console.warn(`Date formatting error for ${dateString}:`, e);
        return 'Fecha inválida';
    }
}
