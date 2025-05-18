export type Service = {
    id          : string;
    name        : string;
    description : string;
};  


export type ExpenseService = {
    id          : string;
    name        : string;
    description : string;
    services    : Service[];
};
