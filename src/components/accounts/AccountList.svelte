<script lang="ts">
    import type { Account } from "@/models/account/account.model";
    import AccountCard      from "./AccountCard.svelte";
    import AccountDetail    from "./AccountDetail.svelte";


    export let accounts: Account[] = [];
    export let selectedAccount: Account | null = null;

    // Estado para filtros
    let searchTerm = '';
    let showOnlyFavorites = false;

    // Filtrar cuentas según criterios de búsqueda
    $: filteredAccounts = accounts.filter(account => {
        // Filtro por favoritos
        if (showOnlyFavorites && !account.isFavorite) {
            return false;
        }
        
        // Filtro por término de búsqueda
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            const nameMatch = account.name?.toLowerCase().includes(searchLower) || false;
            const usernameMatch = account.username.toLowerCase().includes(searchLower);
            
            return nameMatch || usernameMatch;
        }
        
        return true;
    });
    
    // Manejar clic en cuenta
    const handleAccountClick = (account: Account) => {

        selectedAccount = account;
        console.log('🚀 ~ file: AccountList.svelte:50 ~ selectedAccount:', selectedAccount)
    }

</script>

<div class="flex flex-col">
    <!-- Barra de filtros y acciones -->
        <div class="flex flex-col sm:flex-row gap-4 mb-6">
            <!-- Búsqueda -->
            <div class="relative flex-grow">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input 
                    type="text" 
                    bind:value={searchTerm} 
                    placeholder="Buscar por nombre o username..."
                    class="w-full pl-10 pr-4 py-2 bg-white/10 dark:bg-primary-700/20 border border-primary-200/50 dark:border-primary-600/50 rounded-lg text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
            </div>
            
            <!-- Filtro de favoritos -->
            <div class="flex items-center">
                <label class="flex items-center cursor-pointer">
                    <input 
                        type="checkbox" 
                        bind:checked={showOnlyFavorites} 
                        class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Solo favoritos</span>
                </label>
            </div>

        </div>

    
    
    <!-- Contenedor principal con layout fijo -->
    <div class="flex gap-3">
        <div class="w-[calc(100%-320px)]">
            <!-- Mensaje cuando no hay resultados -->
            {#if filteredAccounts.length === 0}
                <div class="bg-white/10 dark:bg-primary-800/20 backdrop-blur-xl rounded-lg p-8 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p class="text-gray-600 dark:text-gray-300">No se encontraron cuentas que coincidan con tu búsqueda</p>
                    <button 
                        on:click={() => { searchTerm = ''; showOnlyFavorites = false; }}
                        class="mt-4 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg inline-flex items-center transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Limpiar filtros
                    </button>
                </div>
            {:else}
                <!-- Grid de tarjetas con número fijo de columnas -->
                <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {#each filteredAccounts as account (account.id)}
                        <AccountCard 
                            {account} 
                            {handleAccountClick} 
                            selectedAccountId={selectedAccount?.id ?? null}
                        />
                    {/each}
                </div>
            {/if}
        </div>


        <div class="w-[300px] flex-shrink-0">
            <AccountDetail {selectedAccount} />
        </div>
    </div>
</div>
