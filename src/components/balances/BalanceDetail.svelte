<script lang="ts">
    import { fade } from 'svelte/transition';

    import toast from "svelte-french-toast";

    import {
        errorToast,
        successToast
    }                           from "@/config/toast/toast.config";
    import PatternBackground    from '@/components/ui/PatternBackground.svelte';
    import DeleteButton         from '@/components/ui/Buttons/DeleteButton.svelte';
    import BalanceForm          from '@/components/balances/BalanceForm.svelte';
    import type { Balance }     from '@/models/balance/balance.model';
    import { TypeBalance }      from '@/models/balance/enum/type-balance.enum';
    import { loadSpaceSafes }   from '@/services/fetch/getSpaceSafes';
    import { deleteBalance }    from '@/stores/balanceStore';
    import { getBalanceIcon }   from '@/lib/balances/get-balance-icon';
    import { getCategoryName }  from '@/lib/balances/get-category-name';
    import { getCardTypeName }  from '@/lib/balances/get-card-type-name';
    import { getCategoryColor } from '@/lib/balances/get-category-color';


    export let selectedBalance: Balance | null = null;

    // Función para formatear la fecha
    function formatDate(dateString: string | null): string {
        if (!dateString) return 'No disponible';
        
        const options: Intl.DateTimeFormatOptions = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    }

    // Función para formatear moneda
    function formatCurrency(amount: number): string {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount);
    }

    // Función para formatear número de tarjeta
    function formatCardNumber(cardNumber: string | null): string {
        if (!cardNumber) return 'No disponible';
        
        // Mostrar solo los últimos 4 dígitos
        if (cardNumber.length > 4) {
            const lastFour = cardNumber.slice(-4);
            return `**** **** **** ${lastFour}`;
        }
        return cardNumber;
    }


    let isVisible = false;
    let openDelete = false;
    let isEdit = false;
    let isLoadingDelete = false;


    $: if ( selectedBalance ) {
        isVisible = true;
    }


    async function confirmDelete(): Promise<void> {
        if ( !selectedBalance ) return;

        isLoadingDelete = true;

        const deletedBalance = await loadSpaceSafes<Balance>({
            url: `/api/space-safes/balances/${selectedBalance.id}`,
            method: 'DELETE'
        });

        console.log('🚀 ~ file: AccountForm.svelte:53 ~ savedAccount:', deletedBalance)

        if ( !deletedBalance ) {
            isLoadingDelete = false;
            toast.error( 'Error al eliminar el balance.', errorToast() );
            return;
        }

        deleteBalance( selectedBalance.id );
        openDelete = false;
        selectedBalance = null;
        isLoadingDelete = false;

        toast.success( 'Balance eliminado correctamente.', successToast() );
    }
</script>

{#if !selectedBalance}
    <div class="flex items-center justify-center p-6 bg-primary-50/30 dark:bg-primary-800/30 backdrop-blur-xl rounded-xl shadow-lg border border-primary-200/50 dark:border-primary-700/50 h-full">
        <PatternBackground patternId="balanceGrid-pending" />

        <p class="text-primary-600 dark:text-primary-300 text-center">
            Selecciona un balance para ver sus detalles
        </p>
    </div>
{:else}
    <div 
        class="overflow-auto bg-primary-50/30 dark:bg-primary-800/30 backdrop-blur-xl rounded-xl shadow-lg border border-primary-200/50 dark:border-primary-700/50 transition-all duration-300 max-h-[calc(100vh-120px)] md:overflow-y-auto {isVisible ? 'opacity-100' : 'opacity-0'}"
        transition:fade={{ duration: 300 }}
    >
        <PatternBackground patternId="balanceGrid-pending" />

        <header class="relative">
            <div class="w-full h-48 py-4 bg-gradient-to-br {getCategoryColor(selectedBalance.type)} grid items-center justify-center relative">
                <div class="absolute top-4 right-4 z-20 text-yellow-400">
                    {#if selectedBalance.isFavorite}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-opacity="0" d="M12 3l2.35 5.76l6.21 0.46l-4.76 4.02l1.49 6.04l-5.29 -3.28l-5.29 3.28l1.49 -6.04l-4.76 -4.02l6.21 -0.46Z"><animate fill="freeze" attributeName="fill-opacity" begin="0.5s" dur="0.5s" values="0;1"/></path><path fill="none" stroke="currentColor" stroke-dasharray="36" stroke-dashoffset="36" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3l-2.35 5.76l-6.21 0.46l4.76 4.02l-1.49 6.04l5.29 -3.28M12 3l2.35 5.76l6.21 0.46l-4.76 4.02l1.49 6.04l-5.29 -3.28"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.5s" values="36;0"/></path></svg>
                    {:else}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-dasharray="36" stroke-dashoffset="36" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3l-2.35 5.76l-6.21 0.46l4.76 4.02l-1.49 6.04l5.29 -3.28M12 3l2.35 5.76l6.21 0.46l-4.76 4.02l1.49 6.04l-5.29 -3.28"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.5s" values="36;0"/></path></svg>
                    {/if}
                </div>

                <DeleteButton
                    confirmDelete={confirmDelete}
                    name="Balance"
                    disabled={isLoadingDelete}
                />

                <button
                    class="absolute bottom-4 right-4 bg-primary-500/50 hover:bg-primary-600 shadow-lg p-1 rounded-lg transition-colors duration-300"
                    aria-label="Editar Balance"
                    on:click={() => isEdit = !isEdit}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="20" stroke-dashoffset="20" d="M3 21h18"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.2s" values="20;0"/></path><path stroke-dasharray="48" stroke-dashoffset="48" d="M7 17v-4l10 -10l4 4l-10 10h-4"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.2s" dur="0.6s" values="48;0"/></path><path stroke-dasharray="8" stroke-dashoffset="8" d="M14 6l4 4"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.2s" values="8;0"/></path></g><path fill="currentColor" fill-opacity="0" d="M14 6l4 4L21 7L17 3Z"><animate fill="freeze" attributeName="fill-opacity" begin="1.1s" dur="0.15s" values="0;0.3"/></path></svg>
                </button>

                <div class="bg-white/20  shadow-xl rounded-full flex items-center justify-center p-4 h-20 w-20 mx-auto">
                    <svelte:component this={getBalanceIcon(selectedBalance?.type)} class="w-16 h-16 text-primary-100" />
                </div>

                <div class="flex justify-center items-start">
                    <h2 class="text-2xl font-bold text-primary-900 dark:text-primary-100">
                        {selectedBalance.name}
                    </h2>
                </div>
            </div>
        </header>

        {#if isEdit}
            <BalanceForm
                balance={selectedBalance}
                bind:open={isEdit}
            />
        {:else}
        <!-- Contenido principal -->
            <main class="p-6">
                <h2 class="text-2xl font-bold text-primary-600 dark:text-primary-300">
                    {formatCurrency(selectedBalance.balance)}
                </h2>

                <!-- Tipo de balance -->
                <div class="mb-4">
                    <h3 class="text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">Tipo de Balance</h3>
                    <div class="flex items-center gap-2">
                        <svelte:component this={getBalanceIcon(selectedBalance?.type)} class="w-6 h-6 text-primary-100" />

                        <span class="text-primary-800 dark:text-primary-200">
                            {getCategoryName(selectedBalance.type)}
                        </span>
                    </div>
                </div>

                <!-- Detalles específicos según el tipo -->
                {#if selectedBalance.type === TypeBalance.BANK_ACCOUNT}
                    <div class="mb-4">
                        <h3 class="text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">Detalles Bancarios</h3>
                        
                        {#if selectedBalance.bankName}
                            <div class="mb-2">
                                <span class="text-primary-500 dark:text-primary-400">Banco:</span>
                                <span class="ml-2 text-primary-800 dark:text-primary-200">{selectedBalance.bankName}</span>
                            </div>
                        {/if}
                        
                        {#if selectedBalance.accountNumber}
                            <div class="mb-2">
                                <span class="text-primary-500 dark:text-primary-400">Número de Cuenta:</span>
                                <span class="ml-2 text-primary-800 dark:text-primary-200 font-mono">{selectedBalance.accountNumber}</span>
                            </div>
                        {/if}
                    </div>
                {:else if selectedBalance.type === TypeBalance.CREDIT || selectedBalance.type === TypeBalance.DEBIT}
                    <div class="mb-4">
                        <h3 class="text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">Detalles de Tarjeta</h3>
                        
                        {#if selectedBalance.typeCard}
                            <div class="mb-2">
                                <span class="text-primary-500 dark:text-primary-400">Tipo de Tarjeta:</span>
                                <span class="ml-2 text-primary-800 dark:text-primary-200">{getCardTypeName(selectedBalance.typeCard)}</span>
                            </div>
                        {/if}

                        {#if selectedBalance.cardNumber}
                            <div class="mb-2">
                                <span class="text-primary-500 dark:text-primary-400">Número de Tarjeta:</span>
                                <span class="ml-2 text-primary-800 dark:text-primary-200 font-mono">{formatCardNumber(selectedBalance.cardNumber)}</span>
                            </div>
                        {/if}

                        {#if selectedBalance.expirationDate}
                            <div class="mb-2">
                                <span class="text-primary-500 dark:text-primary-400">Fecha de Expiración:</span>
                                <span class="ml-2 text-primary-800 dark:text-primary-200">{formatDate(selectedBalance.expirationDate)}</span>
                            </div>
                        {/if}
                    </div>
                {/if}

                <!-- Enlaces asociados (Navly) -->
                {#if selectedBalance.navlyBalances && selectedBalance.navlyBalances.length > 0}
                    <div class="mb-4">
                        <h3 class="text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">Enlaces Asociados</h3>
                        <div class="space-y-2">
                            {#each selectedBalance.navlyBalances as navlyBalance}
                                <div class="bg-primary-50 dark:bg-primary-700/50 p-3 rounded-lg">
                                    <div class="flex items-center justify-between">
                                        <div>
                                            <div class="font-medium text-primary-800 dark:text-primary-200">{navlyBalance.navly.name}</div>
                                            <a 
                                                href={navlyBalance.navly.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                class="text-primary-600 hover:text-primary-800 dark:text-primary-300 dark:hover:text-primary-100 text-sm flex items-center"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                                                </svg>
                                                <span class="truncate">{navlyBalance.navly.url}</span>
                                            </a>
                                        </div>
                                        <div class="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-600 text-primary-700 dark:text-primary-200 rounded-full">
                                            {navlyBalance.navly.category}
                                        </div>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </div>
                {/if}

                <!-- Metadatos -->
                <footer class="mt-6 pt-4 border-t border-primary-200/50 dark:border-primary-700/50">
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        {#if selectedBalance.lastPayment}
                            <div>
                                <p class="text-primary-500 dark:text-primary-400">Último Pago</p>
                                <p class="text-primary-800 dark:text-primary-200">{formatDate(selectedBalance.lastPayment)}</p>
                            </div>
                        {/if}

                        <div>
                            <p class="text-primary-500 dark:text-primary-400">Creado</p>
                            <p class="text-primary-800 dark:text-primary-200">{formatDate(selectedBalance.createdAt)}</p>
                        </div>

                        <div>
                            <p class="text-primary-500 dark:text-primary-400">Actualizado</p>
                            <p class="text-primary-800 dark:text-primary-200">{formatDate(selectedBalance.updatedAt)}</p>
                        </div>
                    </div>
                </footer>
            </main>
        {/if}
    </div>
{/if}
