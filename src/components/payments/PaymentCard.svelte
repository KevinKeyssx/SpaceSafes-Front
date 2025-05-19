<script lang="ts">
    import type { PaymentService } from '@/models/payment-services/payment-service.model';
    import { formatCurrency, formatDate } from '@/utils/currencyUtils';


    export let paymentService: PaymentService;
    export let isSelected: boolean = false;
    export let type: 'pending' | 'paid' = 'pending'; // To distinguish display logic
    export let handleClick: () => void;
</script>

<div
    class="animate-slide-up p-3 rounded-lg shadow-lg border transition-all cursor-pointer z-10 w-full
        {isSelected 
            ? 'bg-primary-100 dark:bg-secondary-600 border-primary-400 dark:border-primary-500 ring-1 ring-primary-500' 
            : 'bg-white dark:bg-primary-700 border-primary-200 dark:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-600'}"
    on:click={handleClick}
    role="button"
    aria-pressed={isSelected}
    aria-label="Seleccionar pago: {paymentService?.description || 'Servicio sin descripción'}"
    tabindex="0"
    on:keydown={(e: KeyboardEvent) => { if (e.key === ' ' || e.key === 'Enter') handleClick(); }}
>
    <div class="flex items-start space-x-3">
        <div class="flex-1">
            <p id="payment-desc-{paymentService?.id}" class="font-medium text-primary-800 dark:text-primary-100">
                {paymentService?.description || 'Sin descripción'}
            </p>
            
            <p class="text-sm text-primary-600 dark:text-primary-300">
                {formatCurrency(paymentService?.amount || 0)}
            </p>

            {#if type === 'pending' && paymentService?.expirationDate}
                <p class="text-xs text-primary-500 dark:text-primary-400">Vence: {formatDate(paymentService.expirationDate)}</p>
            {/if}

            {#if type === 'paid'}
                <p class="text-xs text-green-600 dark:text-green-400">Listo para pagar</p>
            {/if}
        </div>
    </div>
</div>
