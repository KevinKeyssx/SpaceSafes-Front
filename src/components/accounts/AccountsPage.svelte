<script lang="ts">
    import {
        accounts,
        isLoadingAccounts,
        errorAccounts,
        clearAccounts,
        setIsLoadingAccounts,
        setAccounts
    }                               from '@/stores/accountsStore';
    import AccountList              from './AccountList.svelte';
    import Dialog                   from "../ui/bits/Dialog.svelte";
    import AccountForm              from "./AccountForm.svelte";
    import type { Account }         from '@/models/account/account.model';
    import { onMount }              from 'svelte';
    import { loadSpaceSafes }       from '@/services/fetch/getSpaceSafes';


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
</script>

<div class="animate-fade-in">
    <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
            Cuentas
        </h2>

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
