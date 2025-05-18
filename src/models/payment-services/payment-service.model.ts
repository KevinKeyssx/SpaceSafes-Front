export type PaymentService = {
    id: string; // UUID del pago
    userId: string; // ID del usuario asociado
    amount: number; // Valor monetario (puede ser entero o decimal)
    createdAt: string; // Fecha ISO 8601
    updatedAt: string; // Fecha ISO 8601
    expirationDate: string; // Fecha de vencimiento
    description: string | null; // Detalle opcional (nullable)
    serviceId: string; // UUID del servicio relacionado
    navlyId: string | null; // UUID opcional de Navly (nullable)
    currency?: string; // Moneda del pago (e.g., 'EUR', 'USD')
    paidDate?: string; // Fecha ISO 8601 de cuando se pagó, opcional
    status?: 'pending' | 'paid' | 'overdue'; // Estado del pago, opcional
    balanceId?: string; // ID del balance usado para pagar, opcional
};