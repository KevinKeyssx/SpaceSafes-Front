<script lang="ts">
    import { onMount } from 'svelte';

    import { Toaster } from 'svelte-french-toast';

    import {
        accounts,
        isLoadingAccounts,
        errorAccounts,
        clearAccounts,
        setIsLoadingAccounts,
        setAccounts
    }                           from '@/stores/accountsStore';
    import AccountList          from '@/components/accounts/AccountList.svelte';
    import Dialog               from '@/components/ui/bits/Dialog.svelte';
    import AccountForm          from '@/components/accounts/AccountForm.svelte';
    import type { Account }     from '@/models/account/account.model';
    import { loadSpaceSafes }   from '@/services/fetch/getSpaceSafes';
    import Switch               from '@/components/ui/Inputs/Switch.svelte';
    import SpaceLoader          from '@/components/loader/SpaceLoader.svelte';
    import Title from '../ui/Title.svelte';


    async function reloadAccounts() {
        clearAccounts();
        await loadSpaceSafes<Account[]>({ url: '/api/space-safes/accounts' });
    }

    onMount( async () => {
        if ( $accounts.length > 0 ) {
            return;
        }

        setIsLoadingAccounts( true );
        const accountList = await loadSpaceSafes<Account[]>({ url: '/api/space-safes/accounts' });

        if ( accountList === null ) {
            setIsLoadingAccounts( false );
            return;
        }

        setIsLoadingAccounts( false );
        setAccounts( accountList );
    });


    let open = false;
    let searchTerm = '';
    let showOnlyFavorites = false;

    // Filtrar cuentas según criterios de búsqueda
    $: filteredAccounts = $accounts.filter(account => {
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
    
</script>

<Toaster />

<div class="animate-fade-in">
    <Title>
        <div slot="title" class="grid">
            Mis Balances
        </div>

        <div slot="content">
            <Dialog
            buttonText="Añadir Cuenta"
            bind:open={open}
        >
            {#snippet iconButton()}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-dasharray="16" stroke-dashoffset="16" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M5 12h14"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="16;0"/></path><path d="M12 5v14"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.4s" values="16;0"/></path></g></svg>
            {/snippet}

            {#snippet title()}
                Añadir Cuenta
            {/snippet}

            <AccountForm
                account={{} as Account}
                bind:open={open}
            />
        </Dialog>       
        </div>
    </Title>

    <div class="flex items-center justify-between mb-6 gap-4">
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

        <Switch
            bind:checked={showOnlyFavorites}
            label="Solo favoritos"
        />
    </div>

    {#if $isLoadingAccounts}
        <div class="flex items-center justify-center h-full">
            <SpaceLoader />
        </div>
    {:else if $errorAccounts}
        <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            <p>Error al cargar las cuentas. {$errorAccounts.message || 'Intente nuevamente más tarde.'}</p>
            <button 
                class="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                on:click={reloadAccounts}
            >
                Reintentar
            </button>
        </div>
    {:else if $accounts }
        <div class="flex space-x-6">
            <div class="flex-1">
                <AccountList
                    accounts={filteredAccounts }
                    bind:searchTerm={searchTerm}
                    bind:showOnlyFavorites={showOnlyFavorites}
                />
            </div>
        </div>
    {/if}
</div>
