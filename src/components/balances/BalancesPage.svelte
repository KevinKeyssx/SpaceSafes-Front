<script lang="ts">
    import { onMount } from 'svelte';

	import { Toaster } from 'svelte-french-toast';

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
    import SpaceLoader from '../loader/SpaceLoader.svelte';
    import Combobox from '../ui/Inputs/Combobox.svelte';
    import Switch from '../ui/Inputs/Switch.svelte';
    import Input from '../ui/Inputs/Input.svelte';
    import Title from '../ui/Title.svelte';


    let selectedBalance: Balance | null = null;
    let searchTerm = '';
    let categoryFilter = '';
    let showOnlyFavorites = false;
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

<Toaster />

<svelte:window on:keydown={handleKeyDown} />

<div class="space-y-6">
    <Title>
        <div slot="title" class="grid">
            Mis Balances
            <span class="text-2xl font-bold">{formatCurrency(totalBalance)}</span>
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

                <BalanceForm
                    balance={{} as Balance}
                    bind:open={open}
                />
            </Dialog>
        </div>
    </Title>

    <div class="flex flex-col md:flex-row gap-4">
        <div class="grid grid-cols-1 lg:grid-cols-[12fr_3fr_2fr] gap-3 items-center">

        <div class="flex-1 relative w-full">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-primary-500">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
            </div>

            <Input
                type="search"
                placeholder="Buscar por nombre, número de tarjeta o banco..."
                bind:value={searchTerm}
            />
        </div>

        <Combobox
            bind:value={categoryFilter}
            placeholder="Selecciona una categoría"
            options={[
                { value: '', label: 'Todas las categorías' },
                { value: 'BANK_ACCOUNT', label: 'Cuentas Bancarias' },
                { value: 'CASH', label: 'Efectivo' },
                { value: 'CREDIT', label: 'Tarjeta de Crédito' },
                { value: 'DEBIT', label: 'Tarjeta de Débito' },
                { value: 'FREELANCE', label: 'Ingresos Freelance' },
                { value: 'INVESTMENT', label: 'Inversión' },
                { value: 'SAVINGS', label: 'Cuenta de Ahorros' },
                { value: 'OTHER', label: 'Otros' },
            ]}
        />

        <Switch
            bind:checked={showOnlyFavorites}
            label="Solo favoritos"
        />
    </div>

    </div>

    {#if $isLoadingBalanceStore}
        <div class="flex items-center justify-center h-full">
            <SpaceLoader />
        </div>
    {:else if $errorBalanceStore}
        <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            <p>Error al cargar los balances. Intente nuevamente más tarde.</p>
        </div>
    {:else if $balanceStore }
        <div class="flex space-x-6">
            <div class="flex-1">
                <BalanceList
                    balances={ $balanceStore }
                    searchTerm={searchTerm}
                    categoryFilter={categoryFilter}
                    showOnlyFavorites={showOnlyFavorites}
                />
            </div>
        </div>
    {/if}
</div>
