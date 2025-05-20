<script lang="ts">
    import { fade } from 'svelte/transition';

    import { getBalanceIcon } from '@/lib/balances/get-balance-icon';
    import type { Balance } from '@/models/balance/balance.model';
    import { formatCurrency } from '@/lib/utils/currencyUtils';
    import PatternBackground from '../ui/PatternBackground.svelte';

    export let balance: Balance;
    export let isSelected: boolean = false;
    export let onClick: () => void;
</script>

<div
    transition:fade={{ duration: 300 }}
    class="relative animate-slide-up px-3 py-1.5 rounded-lg cursor-pointer transition-all transform hover:scale-105 shadow-lg 
        {isSelected 
            ? ` bg-primary-100 brightness-105 dark:bg-primary-600/70 shadow-xl ring-2 ring-offset-1 ring-primary-500 dark:ring-primary-400 ring-offset-white dark:ring-offset-primary-700`
            : ` dark:bg-primary-700 hover:bg-primary-50 dark:hover:bg-primary-600 text-primary-500`}}"
    on:click={onClick}
    on:keydown={(e) => { if (e.key === ' ' || e.key === 'Enter') onClick(); }}
    role="button"
    tabindex="0"
    aria-labelledby="bal-name-{balance?.id}"
>
    <div class="absolute inset-0 w-full h-full transition-transform duration-300 group-hover:scale-[1.02] z-0">
        <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent opacity-40"></div>
        <PatternBackground patternId="balanceGrid-{balance.id}" />
    </div>

    <svelte:component this={getBalanceIcon( balance.type )} class="w-6 h-6 {isSelected ? 'text-primary-600 dark:text-primary-200' : 'text-primary-100'}" />
    <h3 id="bal-name-{balance.id}" class="font-semibold text-sm truncate {isSelected ? 'text-primary-700 dark:text-primary-100' : 'text-primary-500'}">{balance.name}</h3>
    <p class="text-sm opacity-90 {isSelected ? 'text-green-700 dark:text-green-300' : 'text-green-500'}">{formatCurrency( balance.balance )}</p>
</div>
