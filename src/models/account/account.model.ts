import type { Link } from "../links/link.model";

export type Account = { 
    id          : string;
    name?       : string;
    username    : string;
    password    : string;
    createdAt   : Date;
    updatedAt   : Date;
    isFavorite  : boolean;
    navly       : Navly[];
}


export type Navly = {
    url: string;
}


export type AccountNavly = {
    account: Account;
    navly: Link;
}
