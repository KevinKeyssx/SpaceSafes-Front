import { TypeBalance }  from '@/models/balance/enum/type-balance.enum';

import {
    CreditCard,
    Bank,
    Money,
    ChartLineUp,
    PiggyBank,
    SketchLogo,
    Wallet
} from 'phosphor-svelte';

export const getBalanceIcon = ( type: TypeBalance ) => ({
    [TypeBalance.CASH]          : Money,
    [TypeBalance.BANK_ACCOUNT]  : Bank,
    [TypeBalance.CREDIT]        : CreditCard,
    [TypeBalance.DEBIT]         : CreditCard,
    [TypeBalance.FREELANCE]     : ChartLineUp,
    [TypeBalance.SAVINGS]       : PiggyBank,
    [TypeBalance.INVESTMENT]    : SketchLogo,
    [TypeBalance.OTHER]         : Wallet,
})[type] || Wallet;
