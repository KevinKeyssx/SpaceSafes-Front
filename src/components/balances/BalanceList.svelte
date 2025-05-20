<script lang="ts">
    import BalanceCard from "./BalanceCard.svelte";
    import BalanceDetail from "./BalanceDetail.svelte";
    import type { Balance } from "@/models/balance/balance.model";
    import { fade } from 'svelte/transition';
    
    export let balances: Balance[] = [];
    export let searchTerm: string = '';
    export let categoryFilter: string = '';
    export let showOnlyFavorites: boolean = false;
    
    // Estado para el balance seleccionado
    let selectedBalance: Balance | null = null;
    
    // Función para manejar la selección de un balance
    function handleSelectBalance(balance: Balance) {
        selectedBalance = balance;
    }
    
    // Función para filtrar balances según el término de búsqueda, categoría y favoritos
    $: filteredBalances = balances.filter(balance => {
        const term = searchTerm.toLowerCase().trim();
        const category = categoryFilter?.toLowerCase().trim();

        // Filtrar por favoritos
        const favoriteMatch = !showOnlyFavorites || balance.isFavorite;
        if (!favoriteMatch) return false; // Si no es favorito y se piden solo favoritos, descartar

        // Filtrar por categoría
        const categoryMatch = !category || balance.type?.toLowerCase() === category;

        // Si no hay término de búsqueda, solo importa el filtro de categoría
        if (!term) return categoryMatch;

        // Filtrar por término de búsqueda (si categoryMatch es true)
        if (!categoryMatch) return false; // Si no coincide la categoría, no seguir buscando

        const nameMatch = balance.name?.toLowerCase().includes(term);
        const cardNumberMatch = balance.cardNumber?.toLowerCase().includes(term);
        const bankNameMatch = balance.bankName?.toLowerCase().includes(term);
        
        return nameMatch || cardNumberMatch || bankNameMatch;
    });
</script>

<div class="flex flex-col lg:flex-row gap-4">
    <!-- Lista de balances (responsiva) -->
    <div class="w-full lg:w-3/4">
        <!-- Resultados o mensaje de no resultados -->
        {#if filteredBalances.length === 0}
            <div 
                class="p-6 bg-primary-50/30 dark:bg-primary-800/30 backdrop-blur-xl rounded-xl shadow-lg border border-primary-200/50 dark:border-primary-700/50 text-center"
                transition:fade={{ duration: 200 }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 mx-auto mb-3 text-primary-400">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <p class="text-primary-600 dark:text-primary-300">No se encontraron balances que coincidan con tu búsqueda</p>
                {#if searchTerm}
                    <button 
                        class="mt-3 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors duration-200"
                        on:click={() => searchTerm = ''}
                    >
                        Limpiar búsqueda
                    </button>
                {/if}
            </div>
        {:else}
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
                {#each filteredBalances as balance (balance.id)}
                    <div 
                        role="button" 
                        tabindex="0" 
                        on:click={() => handleSelectBalance(balance)} 
                        on:keydown={(e) => e.key === 'Enter' && handleSelectBalance(balance)}
                        transition:fade={{ duration: 200 }}
                    >
                        <BalanceCard balance={balance} />
                    </div>
                {/each}
            </div>
        {/if}
    </div>
    
    <!-- Panel de detalles (fijo en scroll) -->
    <div class="w-full lg:w-[70%] xl:w-[30%] 2xl:w-[25%] md:sticky md:top-20 md:self-start">
        <BalanceDetail selectedBalance={selectedBalance} />
    </div>
</div>