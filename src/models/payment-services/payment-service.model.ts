import type { Balance } from '@/models/balance/balance.model';
import type { Service } from '@/models/expenses/expense.model';


export type Navly = {
    id      : string;
    name    : string;
    url     : string;
    avatar  : string;
    createdAt       : string;
    updatedAt       : string;
    category        : WebsiteCategory;
    lastViewed      : string;
    isFavorite      : boolean;
}


export type PaymentService = {
    id              : string;
    amount          : number;
    createdAt       : string;
    updatedAt       : string;
    expirationDate  : string;
    description     : string | null;
    service         : Service;
    navly           : Navly | null;
    balance?        : Balance;
};