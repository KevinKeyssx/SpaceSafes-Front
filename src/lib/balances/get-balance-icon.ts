import { TypeBalance }  from '@/models/balance/enum/type-balance.enum';

import CreditCardIcon   from "phosphor-svelte/lib/CreditCard";
import BankIcon         from "phosphor-svelte/lib/Bank";
import CashIcon         from "phosphor-svelte/lib/Money";
import FreelanceIcon    from "phosphor-svelte/lib/ChartLineUp";
import SavingIcon       from "phosphor-svelte/lib/PiggyBank";
import InvestmentIcon   from "phosphor-svelte/lib/SketchLogo";
import OtherIcon        from "phosphor-svelte/lib/Wallet";


export const getBalanceIcon = ( type: TypeBalance ) => ({
    [TypeBalance.CASH]          : CashIcon,
    [TypeBalance.BANK_ACCOUNT]  : BankIcon,
    [TypeBalance.CREDIT]        : CreditCardIcon,
    [TypeBalance.DEBIT]         : CreditCardIcon,
    [TypeBalance.FREELANCE]     : FreelanceIcon,
    [TypeBalance.SAVINGS]       : SavingIcon,
    [TypeBalance.INVESTMENT]    : InvestmentIcon,
    [TypeBalance.OTHER]         : OtherIcon,
})[type] || OtherIcon;
