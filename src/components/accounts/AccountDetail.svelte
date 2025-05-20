<script lang="ts">
    import { fade } from 'svelte/transition';

    import toast from "svelte-french-toast";

    import { errorToast, successToast } from "@/config/toast/toast.config";

    import Dialog from "@/components/ui/bits/Dialog.svelte";
    import AccountForm from "@/components/accounts/AccountForm.svelte";
    import type { Account } from "@/models/account/account.model";
    import { deleteAccount } from '@/stores/accountsStore';
    import { loadSpaceSafes } from "@/services/fetch/getSpaceSafes";
    import ShowIcon from "@/icons/ShowIcon.svelte";
    import DeleteIcon from '@/icons/DeleteIcon.svelte';
    import LoadIcon from '@/icons/LoadIcon.svelte';
    import EditIcon from '@/icons/EditIcon.svelte';
    import PatternBackground from '../ui/PatternBackground.svelte';


    export let selectedAccount: Account | null = null;


    let isLoadingDelete = false;


    function getDomain(url: string): string {
        try {
            return new URL(url).hostname;
        } catch (e) {
            return url;
        }
    }


    async function confirmDelete(): Promise<void> {
        if ( !selectedAccount ) return;

        isLoadingDelete = true;

        const deletedAccount = await loadSpaceSafes<Account>({
            url: `/api/space-safes/accounts/${selectedAccount.id}`,
            method: 'DELETE'
        });

        console.log('🚀 ~ file: AccountForm.svelte:53 ~ savedAccount:', deletedAccount)

        if ( !deletedAccount ) {
            isLoadingDelete = false;
            toast.error( 'Error al eliminar la cuenta.', errorToast() );
            return;
        }

        deleteAccount( selectedAccount.id );

        openDelete = false;
        selectedAccount = null;
        isLoadingDelete = false;

        toast.success( 'Cuenta eliminada correctamente.', successToast() );
    }


    let showPassowrd = false;
    let openDelete = false;
    let isEdit = false;

    function formatDate(date: Date): string {
        return new Date(date).toLocaleString();
    }


    async function coypClipboar( type: string, copy: string ) {
        await navigator.clipboard.writeText( copy );
        toast.success( `${type} copiado correctamente.`, successToast() );
    }
</script>

{#if !selectedAccount}
    <div 
        class="bg-white/10 dark:bg-primary-800/30 backdrop-blur-xl rounded-lg shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 h-full"
    >
        <div class="flex flex-col items-center justify-center h-full min-h-[200px] text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-primary-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-gray-600 dark:text-gray-300">
                Selecciona una cuenta para ver sus detalles
            </p>
        </div>
    </div>
{:else}
    <div 
        class="bg-white dark:bg-primary-700/30 backdrop-blur-xl rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden max-h-[calc(100vh-120px)] md:overflow-y-auto"
        transition:fade={{ duration: 300 }}
    >
        <!-- Encabezado con gradiente -->
        <div class="relative bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white">
            <!-- Botón de favorito -->
            <button 
                class="absolute top-4 right-4 text-white transition-transform"
            >
                {#if selectedAccount.isFavorite}
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-amber-300 drop-shadow-md" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                {:else}
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                {/if}
            </button>

            <div class="flex flex-col items-center">
                <div class="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center mb-4 shadow-lg shadow-primary-900/20 ring-2 ring-primary-400/30 transform transition-transform duration-300 group-hover:scale-110">
                    <span class="text-white text-xl font-bold">{selectedAccount.username.charAt(0).toUpperCase()}</span>
                </div>

                <h2 class="text-2xl font-bold text-white drop-shadow-sm">
                    {selectedAccount.name || selectedAccount.username}
                </h2>
            </div>
            <div class="flex justify-between">

            <Dialog
                    openButtonClass= "bg-primary-700 hover:bg-red-700 p-1 rounded-lg transition-colors duration-300"
                    bind:open={openDelete}
                >
                    {#snippet iconButton()}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="24" stroke-dashoffset="24" d="M12 20h5c0.5 0 1 -0.5 1 -1v-14M12 20h-5c-0.5 0 -1 -0.5 -1 -1v-14"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="24;0"/></path><path stroke-dasharray="20" stroke-dashoffset="20" d="M4 5h16"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.2s" values="20;0"/></path><path stroke-dasharray="8" stroke-dashoffset="8" d="M10 4h4M10 9v7M14 9v7"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="8;0"/></path></g></svg>
                    {/snippet}

                    {#snippet title()}
                        Eliminar Cuenta
                    {/snippet}

                    <div class="space-y-2 w-full">
                        <p class="text-primary-200 grid text-center">¿Estás seguro de eliminar la cuenta?
                            <span class="text-primary-500">
                                Esta acción no se puede deshacer.
                            </span>
                        </p>

                        <button 
                            type="button" 
                            on:click={confirmDelete}
                            disabled={isLoadingDelete}
                            class="disabled:opacity-50 items-center gap-2 mx-auto flex justify-center px-4 py-1 w-48 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        >
                            {#if isLoadingDelete}
                                <LoadIcon />
                            {:else}
                                <DeleteIcon />
                            {/if}

                            Eliminar Cuenta
                        </button>
                    </div>
                </Dialog>

                <button
                    class= "bg-primary-500/50 hover:bg-primary-700 p-1 rounded-lg transition-colors duration-300"
                    aria-label="Editar Cuenta"
                    on:click={() => isEdit = !isEdit}
                >
                    <EditIcon />
                </button>
            </div>
        </div>

        {#if isEdit}
            <div class="py-6">
                <AccountForm
                    account={selectedAccount}
                    bind:open={isEdit}
                />
            </div>
        {:else}
            <div
                class="pb-5 pt-2 px-6 space-y-3 "
                transition:fade={{ duration: 300 }}
            >
                <PatternBackground patternId="balanceGrid-pending" />

                <div class="grid gap-2">
                    <span class="text-sm font-medium text-gray-500 dark:text-primary-400">Usuario</span>

                    <button
                        class="text-normal text-primary-900 dark:text-primary-100 bg-primary-50 dark:bg-primary-700/50 px-2 py-1 rounded"
                        on:click={() => coypClipboar('Usuario', selectedAccount?.username || '')}
                    >
                        {selectedAccount.username}
                    </button>
                </div>

                <div class="grid gap-2">
                    <span class="text-sm font-medium text-gray-500 dark:text-primary-400">Contraseña</span>

                    <div class="flex items-center space-x-2">
                        <button
                            class="text-normal w-full text-primary-900 dark:text-primary-100 font-mono bg-primary-50 dark:bg-primary-700/50 px-2 py-1 rounded"
                            on:click={() => coypClipboar('Contraseña', selectedAccount?.password || '')}
                        >
                            {#if showPassowrd}
                                {selectedAccount?.password}
                            {:else}
                                •••••••••••••••••••••••
                            {/if}
                        </button>

                        <button 
                            type="button" 
                            class="text-primary-500 hover:scale-110 transition-all duration-200 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                            title="Mostrar contraseña"
                            aria-label="Mostrar contraseña"
                            on:click={() => showPassowrd = !showPassowrd}
                        >
                            <ShowIcon />
                        </button>
                    </div>
                </div>

                <!-- Enlaces -->
                <div>
                    <h3 class="text-sm font-medium text-primary-500 dark:text-primary-400 mb-2">Enlaces</h3>

                    {#if selectedAccount.navly && selectedAccount.navly.length > 0}
                        <div class="flex flex-wrap gap-2">
                            {#each selectedAccount.navly as link}
                                <a 
                                    href={link.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    class="inline-flex items-center px-3 py-1.5 bg-primary-100 hover:bg-primary-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full text-sm text-gray-700 dark:text-gray-300 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    {getDomain(link.url)}
                                </a>
                            {/each}
                        </div>
                    {:else}
                        <p class="text-sm text-primary-500 dark:text-primary-400">No hay enlaces disponibles</p>
                    {/if}
                </div>

                <div class="grid grid-cols-2 gap-4 pt-4 border-t border-primary-200 dark:border-gray-700">
                    <div>
                        <span class="text-sm font-medium text-gray-500 dark:text-primary-400 block">Creado</span>
                        <span class="text-sm text-gray-900 dark:text-gray-100">{formatDate(selectedAccount.createdAt)}</span>
                    </div>

                    <div>
                        <span class="text-sm font-medium text-gray-500 dark:text-primary-400 block">Actualizado</span>
                        <span class="text-sm text-gray-900 dark:text-gray-100">{formatDate(selectedAccount.updatedAt)}</span>
                    </div>
                </div>
            </div>
        {/if}
    </div>
{/if}
