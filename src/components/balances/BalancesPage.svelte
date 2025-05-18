<script lang="ts">
    import { onMount } from 'svelte';

    import {
        balanceStore,
        setBalances,
        isLoadingBalanceStore,
        errorBalanceStore,
        setIsLoadingBalanceStore,
    }                           from '@/stores/balanceStore';
    import { loadSpaceSafes }   from '@/services/fetch/getSpaceSafes';
    import type { Balance }     from '@/models/balance/balance.model';
    import BalanceList          from '@/components/balances/BalanceList.svelte';
    import Dialog               from '@/components/ui/bits/Dialog.svelte';
    import BalanceForm          from '@/components/balances/BalanceForm.svelte';


    let selectedBalance: Balance | null = null;
    let searchTerm = '';
    let categoryFilter = '';
    let open = false;



    onMount(async () => {
        if ( $balanceStore.length > 0 ) {
            return;
        }

        setIsLoadingBalanceStore( true );
        const balanceList = await loadSpaceSafes<Balance[]>({ url: '/api/space-safes/balances' });

        if (  balanceList === null ) {
            setIsLoadingBalanceStore( false );
            return;
        }

        setIsLoadingBalanceStore( false );

        setBalances( balanceList );
    });


    $: totalBalance = $balanceStore.reduce(( sum, balance ) => sum + balance.balance, 0 );


    function formatCurrency( amount: number ): string {
        return new Intl.NumberFormat('es-ES', {
            style                   : 'currency',
            currency                : 'EUR',
            minimumFractionDigits   : 2
        }).format( amount );
    }

    // Cerrar el modal de detalles
    function closeModal() {
        selectedBalance = null;
    }

    // Manejar eventos de teclado para accesibilidad
    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === 'Escape' && selectedBalance) {
        closeModal();
        }
    }
</script>

<svelte:window on:keydown={handleKeyDown} />

<div class="space-y-6">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 class="text-2xl font-bold text-primary-900 dark:text-primary-100">Mis Balances</h1>

        <div class="bg-primary-50/50 dark:bg-primary-800/50 px-6 py-3 rounded-lg shadow-sm border border-primary-200/50 dark:border-primary-700/50">
            <div class="text-sm text-primary-600 dark:text-primary-300">Balance total</div>
            <div class="text-2xl font-bold text-primary-900 dark:text-primary-100">{formatCurrency(totalBalance)}</div>
        </div>
    </div>

    <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1 relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-primary-500">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
            </div>

            <input
                type="text"
                placeholder="Buscar por nombre, número de tarjeta o banco..."
                class="w-full pl-10 pr-4 py-2 bg-primary-50/30 dark:bg-primary-800/30 backdrop-blur-xl rounded-lg border border-primary-200/50 dark:border-primary-700/50 text-primary-900 dark:text-primary-100 placeholder-primary-400 dark:placeholder-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                bind:value={searchTerm}
            />
        </div>

        <select
            class="px-4 py-2 bg-primary-50/50 dark:bg-primary-800/50 border border-primary-200/50 dark:border-primary-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 text-primary-900 dark:text-primary-100"
            bind:value={categoryFilter}
        >
            <option value="">Todas las categorías</option>
            <option value="bank">Cuentas Bancarias</option>
            <option value="cash">Efectivo</option>
            <option value="card">Tarjetas</option>
            <option value="freelance">Trabajos Freelance</option>
            <option value="investment">Inversiones</option>
            <option value="savings">Ahorros</option>
        </select>

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

            <BalanceForm
                balance={{} as Balance}
                bind:open={open}
            />
        </Dialog>       
    </div>

    {#if $isLoadingBalanceStore}
        <div class="flex justify-center items-center p-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            <span class="ml-2">Cargando balances...</span>
        </div>
    {:else if $errorBalanceStore}
        <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            <p>Error al cargar los balances. Intente nuevamente más tarde.</p>
        </div>
    {:else if $balanceStore }
        <div class="flex space-x-6">
            <div class="flex-1">
                <BalanceList balances={ $balanceStore } searchTerm={searchTerm} />
            </div>
        </div>
    {/if}
</div>
