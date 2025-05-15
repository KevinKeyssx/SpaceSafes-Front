export type Account = { 
    id          : number;
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