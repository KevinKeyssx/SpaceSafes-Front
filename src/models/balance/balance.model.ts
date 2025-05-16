import { TypeBalance } from "@models/balance/enum/type-balance.enum";
import { TypeCard } from "@models/balance/enum/type-card.enum";


export type Navly = {
    name: string;
    url: string;
    category: string;
};


export type NavlyBalance = {
    navly: Navly;
};


export type Balance = {
    id: string;
    name: string;
    type: TypeBalance | null;
    balance: number;
    typeCard: TypeCard | null;
    cardNumber: string | null;
    accountNumber: string | null;
    bankName: string | null;
    expirationDate: string | null;
    verificationNumber: string | null;
    lastPayment: string | null;
    createdAt: string;
    updatedAt: string;
    navlyBalances: NavlyBalance[];
};  
