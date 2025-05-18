import { TypeBalance } from "@/models/balance/enum/type-balance.enum";

export const getCategoryName = ( type: TypeBalance ): string => ({
    [TypeBalance.CASH]          : 'Efectivo',
    [TypeBalance.BANK_ACCOUNT]  : 'Cuenta Bancaria',
    [TypeBalance.CREDIT]        : 'Tarjeta de Crédito',
    [TypeBalance.DEBIT]         : 'Tarjeta de Débito',
    [TypeBalance.FREELANCE]     : 'Trabajo Freelance',
    [TypeBalance.INVESTMENT]    : 'Inversión',
    [TypeBalance.SAVINGS]       : 'Ahorros',
    [TypeBalance.OTHER]         : 'Otro',
})[type] || 'Otro';
