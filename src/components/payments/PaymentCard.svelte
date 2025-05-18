<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    // Assuming ClientPaymentService will be available from PaymentsBoard or a shared model file
    interface ClientPaymentService {
        id: string;
        description: string | null;
        amount: number;
        currency?: string;
        expirationDate?: string | null;
        paidDate?: string | null;
        status?: 'pending' | 'paid' | 'overdue';
        balanceId?: string | null;
        isSavedToDB?: boolean; 
    }
    import { formatCurrency, formatDate } from '@/utils/currencyUtils';

    export let payment: ClientPaymentService;
    export let isSelected: boolean = false;

    const dispatch = createEventDispatcher();

    function handleSelectionChange(event: Event) {
        const target = event.target as HTMLInputElement;
        dispatch('toggleSelect', { id: payment.id, selected: target.checked });
    }
</script>

<div 
    class="p-3 rounded-md shadow-sm border transition-all
           {isSelected 
               ? 'bg-primary-100 dark:bg-primary-700 border-primary-400 dark:border-primary-500 ring-1 ring-primary-500' 
               : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'}"
>
    <div class="flex items-start space-x-3">
        <input 
            type="checkbox"
            class="mt-1 h-4 w-4 text-primary-600 border-gray-300 dark:border-gray-500 rounded focus:ring-primary-500 dark:bg-gray-600 dark:checked:bg-primary-500"
            checked={isSelected}
            on:change={handleSelectionChange}
            aria-labelledby="payment-desc-{payment.id}"
        />
        <div class="flex-1">
            <p id="payment-desc-{payment.id}" class="font-medium text-gray-800 dark:text-gray-100">{payment.description || 'Sin descripción'}</p>
            <p class="text-sm text-gray-600 dark:text-gray-300">
                {formatCurrency(payment.amount, payment.currency)}
            </p>
            {#if payment.status === 'pending' && payment.expirationDate}
                <p class="text-xs text-gray-500 dark:text-gray-400">Vence: {formatDate(payment.expirationDate)}</p>
            {/if}
            {#if payment.status === 'paid' && payment.paidDate}
                <p class="text-xs text-green-600 dark:text-green-400">Pagado: {formatDate(payment.paidDate)}</p>
                {#if payment.balanceId}
                    <span class="text-xs text-gray-500 dark:text-gray-400">(Balance ID: {payment.balanceId})</span>
                {/if}
            {/if}
            {#if payment.status === 'overdue'}
                 <p class="text-xs text-red-600 dark:text-red-400">Vencido: {formatDate(payment.expirationDate)}</p>
            {/if}
        </div>
    </div>
</div>
