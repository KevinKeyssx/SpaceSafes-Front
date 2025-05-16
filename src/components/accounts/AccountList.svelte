<script lang="ts">
    import type { Account } from "@/models/account/account.model";
    import AccountCard      from "./AccountCard.svelte";
    import AccountDetail    from "./AccountDetail.svelte";
    import { fade } from 'svelte/transition';

    export let accounts: Account[] = [];
    export let selectedAccount: Account | null = null;

    // Estado para filtros
    let searchTerm = '';
    let showOnlyFavorites = false;
    let isAddingAccount = false;
    
    // Nueva cuenta
    let newAccount = {
        id: 0,
        username: '',
        password: '',
        name: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        isFavorite: false,
        navly: []
    };
    
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
    const handleAccountClick = (account: Account) => selectedAccount = account;
    
    // Alternar modo de añadir cuenta
    function toggleAddAccount() {
        isAddingAccount = !isAddingAccount;
        if (!isAddingAccount) {
            // Resetear formulario
            newAccount = {
                id: 0,
                username: '',
                password: '',
                name: '',
                createdAt: new Date(),
                updatedAt: new Date(),
                isFavorite: false,
                navly: []
            };
        }
    }
    
    // Añadir nueva cuenta
    function addAccount() {
        // Aquí implementarías la lógica para añadir la cuenta
        // Por ejemplo, llamar a una función del store
        console.log('Añadir cuenta:', newAccount);
        
        // Resetear estado
        toggleAddAccount();
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
            
            <!-- Botón añadir cuenta -->
            <button 
                on:click={toggleAddAccount}
                class="sm:ml-auto px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex items-center justify-center transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Añadir cuenta
            </button>
        </div>

    <!-- Formulario para añadir cuenta (condicional) -->
    {#if isAddingAccount}
        <div class="mb-6 bg-white dark:bg-emerald-700/30 backdrop-blur-xl rounded-lg p-5 border border-primary-200 dark:border-primary-700 shadow-lg" transition:fade={{ duration: 200 }}>
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Añadir nueva cuenta</h3>
            
            <form class="space-y-4" on:submit|preventDefault={addAccount}>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Nombre -->
                    <div>
                        <label for="new-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
                        <input 
                            id="new-name"
                            type="text" 
                            bind:value={newAccount.name} 
                            class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Nombre (opcional)"
                        />
                    </div>
                    
                    <!-- Username -->
                    <div>
                        <label for="new-username" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                        <input 
                            id="new-username"
                            type="text" 
                            bind:value={newAccount.username} 
                            required
                            class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Username"
                        />
                    </div>
                    
                    <!-- Contraseña -->
                    <div>
                        <label for="new-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contraseña</label>
                        <input 
                            id="new-password"
                            type="password" 
                            bind:value={newAccount.password} 
                            required
                            class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Contraseña"
                        />
                    </div>
                    
                    <!-- Favorito -->
                    <div class="flex items-center">
                        <label for="new-favorite" class="flex items-center cursor-pointer">
                            <input 
                                id="new-favorite"
                                type="checkbox" 
                                bind:checked={newAccount.isFavorite} 
                                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                            <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Marcar como favorito</span>
                        </label>
                    </div>
                </div>
                
                <!-- Botones de acción -->
                <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button 
                        type="button" 
                        on:click={toggleAddAccount}
                        class="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md transition-colors"
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors"
                    >
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    {/if}
    
    <!-- Contenedor principal con layout fijo -->
    <div class="flex">
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

        <div class="w-6"></div>

        <div class="w-[300px] flex-shrink-0">
            <AccountDetail {selectedAccount} />
        </div>
    </div>
</div>
