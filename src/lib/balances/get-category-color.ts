import { TypeBalance } from "@/models/balance/enum/type-balance.enum";

export const getCategoryColor = ( type: TypeBalance ): string => ({
    [TypeBalance.CASH]          : 'from-green-500 to-green-700',
    [TypeBalance.BANK_ACCOUNT]  : 'from-blue-500 to-blue-700',
    [TypeBalance.CREDIT]        : 'from-primary-500 to-primary-700',
    [TypeBalance.DEBIT]         : 'from-primary-500 to-primary-700',
    [TypeBalance.FREELANCE]     : 'from-purple-500 to-purple-700',
    [TypeBalance.INVESTMENT]    : 'from-orange-500 to-orange-700',
    [TypeBalance.SAVINGS]       : 'from-indigo-500 to-indigo-700',
    [TypeBalance.OTHER]         : 'from-amber-500 to-amber-700',
})[type] || 'from-amber-500 to-amber-700';