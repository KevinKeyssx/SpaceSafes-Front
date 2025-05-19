<script lang="ts">
    import type { Balance } from '@/models/balance/balance.model';
    import { formatCurrency } from '@/utils/currencyUtils';

    export let balance: Balance;
    export let isSelected: boolean = false;
    export let onClick: () => void;
</script>

<div 
    class="px-3 py-1.5 rounded-lg cursor-pointer transition-all transform hover:scale-105 shadow-lg
        {isSelected 
            ? 'bg-primary-500 text-white ring-2 ring-primary-600 dark:ring-primary-400' 
            : 'bg-white dark:bg-primary-700 hover:bg-primary-50 dark:hover:bg-primary-600'}"
    on:click={onClick}
    on:keydown={(e) => { if (e.key === ' ' || e.key === 'Enter') onClick(); }}
    role="radio"
    aria-checked={isSelected}
    tabindex="0"
    aria-labelledby="bal-name-{balance?.id}"
>
    {#if balance}
        <h3 id="bal-name-{balance.id}" class="font-semibold text-sm truncate">{balance.name}</h3>
        <p class="text-xs opacity-90">{formatCurrency( balance.balance )}</p>
    {:else}
        <p class="text-xs opacity-90">Balance data not available.</p> 
    {/if}
</div>
