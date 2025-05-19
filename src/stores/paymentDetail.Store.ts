import { writable, type Writable } from 'svelte/store';
import type { PaymentDetail } from '@/models/payment-detail/payment-detail.model';

// Store for payment details
const paymentDetailStore: Writable<PaymentDetail[]> = writable([]);
const isLoadingPaymentDetailStore: Writable<boolean> = writable(false);
const errorPaymentDetailStore: Writable<Error | null> = writable(null);

// Functions to manipulate the store
function addPaymentDetail(paymentDetail: PaymentDetail) {
    paymentDetailStore.update(items => [
        ...items,
        paymentDetail
    ]);
}


function addMultiplePaymentDetails(paymentDetails: PaymentDetail[]) {
    paymentDetailStore.update(items => {
        const newItems = paymentDetails.filter(
            newItem => !items.some(existingItem => existingItem.id === newItem.id)
        );

        return newItems.length > 0 ? [...items, ...newItems] : items;
    });
}


function setPaymentDetails(paymentDetailsList: PaymentDetail[]) {
    paymentDetailStore.set(paymentDetailsList);
}

function removePaymentDetail(paymentDetailId: string): void {
    paymentDetailStore.update(items => 
        items.filter(detail => detail.id !== paymentDetailId)
    );
}

function removePaymentDetailsByServiceIds(paymentServiceIds: string[]): void {
    paymentDetailStore.update(items => 
        items.filter(detail => !paymentServiceIds.includes(detail.paymentService.id))
    );
}

function clearPaymentDetails(): void {
    paymentDetailStore.set([]);
}

function setIsLoadingPaymentDetailStore(isLoading: boolean): void {
    isLoadingPaymentDetailStore.set(isLoading);
}

function setErrorPaymentDetailStore(error: Error | null): void {
    errorPaymentDetailStore.set(error);
}

export {
    paymentDetailStore,
    isLoadingPaymentDetailStore,
    errorPaymentDetailStore,
    addPaymentDetail,
    addMultiplePaymentDetails,
    setPaymentDetails,
    removePaymentDetail,
    removePaymentDetailsByServiceIds,
    clearPaymentDetails,
    setIsLoadingPaymentDetailStore,
    setErrorPaymentDetailStore
};