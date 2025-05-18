import type { WebsiteCategory } from "./enum/web-category.enum";
import { TypeBalance } from "@models/balance/enum/type-balance.enum";


export type Balance = {
    id      : string;
    name    : string;
    balance : number;
    type    : TypeBalance;
};


export type NavlyBalance = {
    id              : string;
    principal       : boolean;
    expirationDate  : string | null;
    createdAt       : string;
    updatedAt       : string;
    balance         : Balance;
    amount          : number;
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


export type LinkSave = {
    id              : string;
    name            : string;
    avatar          : string;
    description     : string;
    url             : string;
    category        : WebsiteCategory;
    isFavorite      : boolean;
    balanceIds      : string[];
    amount?         : number;
    expirationDate? : string;
}