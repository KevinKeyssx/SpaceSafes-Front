<script lang="ts">
    import type { PaymentService } from '@/models/payment-services/payment-service.model';
    import { formatCurrency } from '@/lib/utils/currencyUtils';
    import GlowEffects from '../ui/GlowEffects.svelte';
    import { fade } from 'svelte/transition';


    export let paymentService: PaymentService;
    export let isSelected: boolean = false;
    export let type: 'pending' | 'paid' = 'pending'; // To distinguish display logic
    export let handleClick: () => void;
</script>

<div
    transition:fade={{ duration: 300 }}
    class="relative animate-slide-up p-3 rounded-lg shadow-lg transition-all cursor-pointer z-10 w-full overflow-hidden hover:scale-[1.02] duration-300
        {isSelected 
            ? 'bg-primary-100 border-none dark:bg-primary-600 ring-2 ring-primary-500 dark:ring-primary-400' 
            : 'bg-white dark:bg-primary-700 border-none ring-1 dark:ring-primary-600 hover:bg-primary-50 dark:hover:bg-primary-600'}"
    on:click={handleClick}
    role="button"
    aria-pressed={isSelected}
    aria-label="Seleccionar pago: {paymentService?.description || 'Servicio sin descripción'}"
    tabindex="0"
    on:keydown={(e: KeyboardEvent) => { if (e.key === ' ' || e.key === 'Enter') handleClick(); }}
>
    <GlowEffects />

    <div class="flex items-start space-x-3">
        <div class="flex-1">
            <p id="payment-desc-{paymentService?.id}" class="font-medium text-primary-800 dark:text-primary-100 truncate">
                {paymentService?.description || 'Sin descripción'}
            </p>
            
            <p class="text-sm text-primary-600 dark:text-primary-300">
                {formatCurrency(paymentService?.amount || 0)}
            </p>

            {#if type === 'paid'}
                <p class="text-xs text-green-600 dark:text-green-400">Listo para pagar</p>
            {/if}

            {#if paymentService.balance}
                <p class="text-xs text-primary-500 dark:text-primary-400">
                    Balance: {paymentService?.balance.name}
                </p>
            {/if}
        </div>
    </div>
</div>
