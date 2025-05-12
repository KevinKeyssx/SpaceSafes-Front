<script lang="ts">
  import { onMount } from 'svelte';

  // Definición de tipos
  interface Balance {
    id: number;
    name: string;
    amount: number;
    category: string;
  }

  // Props
  export let balances: Balance[] = [];
  export let onSelectBalance: (id: number) => void;
  export let selectedBalanceId: number | null = null;

  // Estado
  let isOpen = false;
  let selectedBalance: Balance | null = null;
  
  // Reactividad
  $: {
    if (selectedBalanceId && balances.length > 0) {
      const balance = balances.find(b => b.id === selectedBalanceId);
      selectedBalance = balance || null;
    } else if (balances.length > 0 && !selectedBalance) {
      // Si no hay balance seleccionado pero hay balances disponibles, seleccionar el primero
      selectedBalance = balances[0];
      onSelectBalance(balances[0].id);
    } else if (balances.length === 0) {
      selectedBalance = null;
    }
  }
  
  // Métodos
  function handleSelectBalance(balance: Balance): void {
    selectedBalance = balance;
    onSelectBalance(balance.id);
    isOpen = false;
  }
  
  function getCategoryIcon(category: string): string {
    switch (category) {
      case 'cash':
        return `
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 01-.75.75h-.75m-6-1.5H2.25m19.5 0v.75c0 .414-.336.75-.75.75h-.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 01-.75.75h-.75" />
          </svg>
        `;
      case 'bank':
        return `
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
          </svg>
        `;
      case 'card':
        return `
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
          </svg>
        `;
      default:
        return `
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        `;
    }
  }
  
  function getCategoryColor(category: string): string {
    switch (category) {
      case 'cash':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'bank':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'card':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'freelance':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'investment':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300';
      case 'savings':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
      default:
        return 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300';
    }
  }
  
  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(amount);
  }
</script>

{#if balances.length === 0}
  <div class="bg-primary-50/30 dark:bg-primary-800/30 backdrop-blur-xl rounded-lg shadow-sm border border-primary-200/50 dark:border-primary-700/50 p-3 text-center">
    <p class="text-primary-600 dark:text-primary-300 text-sm">
      No hay balances disponibles.
      <a href="/balances" class="text-primary-700 dark:text-primary-200 underline ml-1">
        Añadir balance
      </a>
    </p>
  </div>
{:else}
  <div class="relative">
    <button
      type="button"
      class="w-full bg-primary-50/30 dark:bg-primary-800/30 backdrop-blur-xl rounded-lg shadow-sm border border-primary-200/50 dark:border-primary-700/50 p-3 flex items-center justify-between"
      on:click={() => isOpen = !isOpen}
      aria-expanded={isOpen}
      aria-haspopup="listbox"
    >
      {#if selectedBalance}
        <div class="flex items-center">
          <div class={`p-2 rounded-lg mr-3 ${getCategoryColor(selectedBalance.category)}`}>
            {@html getCategoryIcon(selectedBalance.category)}
          </div>
          <div class="text-left">
            <div class="font-medium text-primary-900 dark:text-primary-100">{selectedBalance.name}</div>
            <div class="text-sm text-primary-600 dark:text-primary-300">{formatCurrency(selectedBalance.amount)}</div>
          </div>
        </div>
      {:else}
        <span class="text-primary-600 dark:text-primary-300">Seleccionar balance</span>
      {/if}
      
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class={`w-5 h-5 text-primary-500 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>
    </button>
    
    {#if isOpen}
      <div class="absolute z-10 mt-1 w-full bg-primary-50/90 dark:bg-primary-800/90 backdrop-blur-xl rounded-lg shadow-lg border border-primary-200/50 dark:border-primary-700/50 max-h-60 overflow-auto" role="listbox">
        <ul class="py-1">
          {#each balances as balance (balance.id)}
            <li>
              <button
                type="button"
                class={`w-full px-3 py-2 text-left hover:bg-primary-100/50 dark:hover:bg-primary-700/50 ${selectedBalance && selectedBalance.id === balance.id ? 'bg-primary-100 dark:bg-primary-700/30' : ''}`}
                on:click={() => handleSelectBalance(balance)}
                role="option"
                aria-selected={selectedBalance && selectedBalance.id === balance.id}
              >
                <div class="flex items-center">
                  <div class={`p-2 rounded-lg mr-3 ${getCategoryColor(balance.category)}`}>
                    {@html getCategoryIcon(balance.category)}
                  </div>
                  <div>
                    <div class="font-medium text-primary-900 dark:text-primary-100">{balance.name}</div>
                    <div class="text-sm text-primary-600 dark:text-primary-300">{formatCurrency(balance.amount)}</div>
                  </div>
                </div>
              </button>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  </div>
{/if}
