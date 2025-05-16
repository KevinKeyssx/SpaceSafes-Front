import type { WebsiteCategory } from "./enum/web-category.enum";
import { TypeBalance } from "@models/balance/enum/type-balance.enum";


export type Balance = {
    name    : string;
    balance : number;
    type    : TypeBalance;
};


export type NavlyBalance = {
    principal       : boolean;
    expirationDate  : string | null;
    createdAt       : string;
    updatedAt       : string;
    balance         : Balance;
};


export type Account = {
    id          : string;
    name        : string | null;
    username    : string;
};


export type Link = {
    id              : string;
    name            : string | null;
    avatar          : string | null;
    description     : string | null;
    url             : string;
    createdAt       : string;
    updatedAt       : string;
    category        : WebsiteCategory;
    lastViewed      : string;
    isFavorite      : boolean;
    navlyBalances   : NavlyBalance[];
    account         : Account | null;
};
