import { writable } from 'svelte/store';
import type { PaymentService } from '@/models/payment-services/payment-service.model';

// Store para los payment services
const paymentServiceStore = writable<PaymentService[]>([]);
const isLoadingPaymentServiceStore = writable<boolean>(false);
const errorPaymentServiceStore = writable<Error | null>(null);

// Funciones para manipular el store
function addPaymentService(paymentService: PaymentService) {
    paymentServiceStore.update(items => ([
        ...items,
        paymentService
    ]));
}

function setPaymentServices(paymentServicesList: PaymentService[]) {
    paymentServiceStore.set(paymentServicesList);
}

function updatePaymentService(updatedPaymentService: PaymentService): void {
    paymentServiceStore.update(items => {
        const index = items.findIndex(paymentService => paymentService.id === updatedPaymentService.id);
        
        if (index !== -1) {
            const updatedPaymentServices = [...items];
            updatedPaymentServices[index] = updatedPaymentService;
            return updatedPaymentServices;
        }
        
        return items;
    });
}

function deletePaymentService(id: string): void {
    paymentServiceStore.update(items => 
        items.filter(paymentService => paymentService.id !== id)
    );
}

function clearPaymentServices(): void {
    paymentServiceStore.set([]);
}

function setIsLoadingPaymentServiceStore(isLoading: boolean): void {
    isLoadingPaymentServiceStore.set(isLoading);
}

function setErrorPaymentServiceStore(error: Error | null): void {
    errorPaymentServiceStore.set(error);
}

export {
    paymentServiceStore,
    isLoadingPaymentServiceStore,
    errorPaymentServiceStore,
    addPaymentService,
    setPaymentServices,
    updatePaymentService,
    deletePaymentService,
    clearPaymentServices,
    setIsLoadingPaymentServiceStore,
    setErrorPaymentServiceStore
};
