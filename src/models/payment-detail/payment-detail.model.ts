import type { PaymentService } from '@/models/payment-services/payment-service.model';
// import type { Balance } from '@/models/balance/balance.model';

type Balance = {
    id: string;
    name: string;
    type: string;
    balance: number;
    lastPayment: string;
}


type PaymentService = {
    id : string,
    description : string,
}

export type PaymentDetail = {
    id: string;
    amount: number;
    createdAt: string;
    updatedAt: string;
    payment: Payment;
    paymentService: PaymentService;
    status : "COMPLETED" | "PENDING" | "CANCELLED";
    balance: Balance;
    paymentService : PaymentService;
};


export type Payment = {
    id: string;
    month: number;
    year: number;
};
