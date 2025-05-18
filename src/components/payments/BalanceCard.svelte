<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    // Assuming Balance type will be made available, e.g., from a models file or PaymentsBoard module context
    // For now, let's define it locally for the card to be self-contained until refactoring
    interface Balance {
        id: string;
        name: string;
        currentAmount: number;
        currency: string;
    }
    import { formatCurrency } from '@/utils/currencyUtils';

    export let balance: Balance;
    export let isSelected: boolean = false;

    const dispatch = createEventDispatcher();

    function handleClick() {
        dispatch('select', balance);
    }
</script>

<div 
    class="p-3 rounded-lg shadow cursor-pointer transition-all transform hover:scale-105
           {isSelected 
               ? 'bg-primary-500 text-white ring-2 ring-primary-600 dark:ring-primary-400' 
               : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'}"
    on:click={handleClick}
    on:keydown={(e) => { if (e.key === ' ' || e.key === 'Enter') handleClick(); }}
    role="radio"
    aria-checked={isSelected}
    tabindex="0"
    aria-labelledby="bal-name-{balance.id}"
>
    <h3 id="bal-name-{balance.id}" class="font-semibold text-sm truncate">{balance.name}</h3>
    <p class="text-xs opacity-90">{formatCurrency(balance.currentAmount, balance.currency)}</p>
</div>

<style>
    /* Add any component-specific styles here if needed */
</style>
