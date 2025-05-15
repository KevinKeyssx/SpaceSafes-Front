<script lang="ts">
    import {
        accounts,
        isLoadingAccounts,
        errorAccounts,
        clearAccounts
    }                               from '@/stores/accountsStore';
    import { loadAccountsStore }    from '@/lib/accounts/getAccounts';
    import AccountList              from './AccountList.svelte';


    loadAccountsStore()


    function reloadAccounts() {
        clearAccounts();
        loadAccountsStore();
    }
</script>

<div class="animate-fade-in">
    <h2 class="text-2xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
        Cuentas
    </h2>

    {#if $isLoadingAccounts}
        <div class="flex justify-center items-center p-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            <span class="ml-2">Cargando cuentas...</span>
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
                <AccountList accounts={$accounts } />
            </div>
        </div>
    {/if}
</div>
