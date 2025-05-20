<script lang="ts">
    import toast from "svelte-french-toast";

    import {
        errorToast,
        successToast
    }                           from "@/config/toast/toast.config";
    import type { Link, LinkSave } from '@/models/links/link.model';
    import LinkForm from './LinkForm.svelte';
    import { loadSpaceSafes } from '@/services/fetch/getSpaceSafes';
    import { deleteLink } from '@/stores/linksStore';
    import { getBalanceIcon }   from "@/lib/balances/get-balance-icon";
    import { fade } from 'svelte/transition';
    import PatternBackground from '../ui/PatternBackground.svelte';
    import GlowEffects from '../ui/GlowEffects.svelte';
    import DeleteButton from '../ui/Buttons/DeleteButton.svelte';


    export let selectedLink: Link | null = null;


    const noImage = 'https://res.cloudinary.com/dbgzsikcs/image/upload/v1747376624/sample/3f68b623-b1d4-48a8-bd3f-6a7c3fce6397.avif'


    function formatDate(dateString: string): string {
        const options: Intl.DateTimeFormatOptions = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    }

    let isVisible = false;
    let openDelete = false;
    let isEdit = false;
    let isLoadingDelete = false;


    $: if ( selectedLink ) {
        isVisible = true;
    }


    function linkToLinkSave( link: Link ): LinkSave {
        return {
            id: link.id,
            name: link.name || '',
            avatar: link.avatar || '',
            description: link.description || '',
            url: link.url,
            category: link.category,
            isFavorite: link.isFavorite,
            balanceIds: link.navlyBalances?.map(balance => balance.balance.id) || [],
            amount: link.navlyBalances?.[0]?.amount || 0,
            expirationDate: link.navlyBalances?.[0]?.expirationDate ? new Date(link.navlyBalances?.[0]?.expirationDate).toISOString().split('T')[0] : undefined,
        };
    }


    async function confirmDelete(): Promise<void> {
        if (!selectedLink) return;

        isLoadingDelete = true;

        const deletedLink = await loadSpaceSafes<Link>({
            url: `/api/space-safes/navly/${selectedLink.id}`,
            method: 'DELETE'
        });

        if ( !deletedLink ) {
            isLoadingDelete = false;
            toast.error( 'Error al eliminar el enlace.', errorToast() );
            return;
        }

        deleteLink( selectedLink.id );
        openDelete = false;
        selectedLink = null;
        isLoadingDelete = false;

        toast.success( 'Enlace eliminado correctamente.', successToast() );
    }
</script>

{#if !selectedLink}
    <div class="flex items-center justify-center p-6 bg-primary-50/30 dark:bg-primary-800/30 backdrop-blur-xl rounded-xl shadow-lg border border-primary-200/50 dark:border-primary-700/50 h-full overflow-hidden ">
        <PatternBackground patternId="balanceGrid-pending" />

        <p class="text-primary-600 dark:text-primary-300 text-center">
            Selecciona un enlace para ver sus detalles
        </p>
    </div>
{:else}
    <div
        class="relative bg-primary-50/30 dark:bg-primary-800/30 backdrop-blur-xl rounded-xl shadow-lg border border-primary-200/50 dark:border-primary-700/50 transition-all duration-300 {isVisible ? 'opacity-100' : 'opacity-0'} overflow-hidden"
        transition:fade={{ duration: 300 }}
    >
        <PatternBackground patternId="linkdetail" />
        <GlowEffects />


        <!-- Header con imagen -->
        <div class="relative">
            <img 
                src={selectedLink.avatar || noImage} 
                alt={selectedLink.name || 'Imagen del enlace'} 
                class="w-full h-48 object-cover"
            />

            <div class="absolute top-2 right-2 z-20 text-yellow-400">
                {#if selectedLink.isFavorite}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-opacity="0" d="M12 3l2.35 5.76l6.21 0.46l-4.76 4.02l1.49 6.04l-5.29 -3.28l-5.29 3.28l1.49 -6.04l-4.76 -4.02l6.21 -0.46Z"><animate fill="freeze" attributeName="fill-opacity" begin="0.5s" dur="0.5s" values="0;1"/></path><path fill="none" stroke="currentColor" stroke-dasharray="36" stroke-dashoffset="36" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3l-2.35 5.76l-6.21 0.46l4.76 4.02l-1.49 6.04l5.29 -3.28M12 3l2.35 5.76l6.21 0.46l-4.76 4.02l1.49 6.04l-5.29 -3.28"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.5s" values="36;0"/></path></svg>
                {:else}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-dasharray="36" stroke-dashoffset="36" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3l-2.35 5.76l-6.21 0.46l4.76 4.02l-1.49 6.04l5.29 -3.28M12 3l2.35 5.76l6.21 0.46l-4.76 4.02l1.49 6.04l-5.29 -3.28"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.5s" values="36;0"/></path></svg>
                {/if}
            </div>

            <!-- Botón de eliminar (esquina izquierda) -->
            <div class="absolute bottom-2 left-1 ">
                <DeleteButton
                    confirmDelete={confirmDelete}
                    name="Enlace"
                    disabled={isLoadingDelete}
                />
            </div>

            <!-- Botones de la esquina derecha -->
            <div class="absolute bottom-2 right-2 flex flex-col gap-2">
                <a 
                href={selectedLink.url} 
                target="_blank" 
                rel="noopener noreferrer"
                class="bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-full transition-colors duration-300 flex items-center justify-center"
                aria-label="Abrir enlace en nueva pestaña"
                >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
                </a>

                <button
                class= "bg-primary-500/50 hover:bg-primary-700 p-1 rounded-lg transition-colors duration-300"
                aria-label="Editar Enlace"
                on:click={() => isEdit = !isEdit}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="20" stroke-dashoffset="20" d="M3 21h18"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.2s" values="20;0"/></path><path stroke-dasharray="48" stroke-dashoffset="48" d="M7 17v-4l10 -10l4 4l-10 10h-4"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.2s" dur="0.6s" values="48;0"/></path><path stroke-dasharray="8" stroke-dashoffset="8" d="M14 6l4 4"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.2s" values="8;0"/></path></g><path fill="currentColor" fill-opacity="0" d="M14 6l4 4L21 7L17 3Z"><animate fill="freeze" attributeName="fill-opacity" begin="1.1s" dur="0.15s" values="0;0.3"/></path></svg>
                </button>
            </div>
        </div>

        {#if isEdit}
            <LinkForm link={linkToLinkSave(selectedLink)} bind:open={isEdit}/>
        {:else}
            <!-- Contenido principal -->
            <div class="p-6">
                <div class="flex justify-between items-start mb-4">
                    <h2 class="text-2xl font-bold text-primary-900 dark:text-primary-100">
                    {selectedLink.name || 'Sin nombre'}
                    </h2>
                    
                    {#if selectedLink.account}
                    <span class="text-sm bg-primary-100 dark:bg-primary-700 text-primary-700 dark:text-primary-200 px-2 py-1 rounded-full ml-2">
                        @{selectedLink.account.username}
                    </span>
                    {/if}
                </div>

                <!-- URL -->
                <div class="mb-4">
                    <h3 class="text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">URL</h3>
                    <a 
                    href={selectedLink.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="text-primary-600 hover:text-primary-800 dark:text-primary-300 dark:hover:text-primary-100 text-sm break-all flex items-center"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1 flex-shrink-0">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                    </svg>
                    <span class="truncate">{selectedLink.url}</span>
                    </a>
                </div>

                <!-- Descripción -->
                {#if selectedLink.description}
                    <div class="mb-4">
                    <h3 class="text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">Descripción</h3>
                    <p class="text-primary-700 dark:text-primary-200 text-sm">
                        {selectedLink.description}
                    </p>
                    </div>
                {/if}

                <!-- Balances -->
                {#if selectedLink.navlyBalances && selectedLink.navlyBalances.length > 0}
                    <div class="mb-4">
                    <h3 class="text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">Balances</h3>
                    <div class="grid grid-cols-2 gap-2">
                        {#each selectedLink.navlyBalances as balance}
                        <div class="bg-primary-50 dark:bg-primary-800/50 p-3 rounded-lg">
                            <div class="flex items-center mb-1">

                            <svelte:component this={getBalanceIcon( balance.balance.type )} class="w-5 h-5 mr-2 text-primary-600 dark:text-primary-300" />

                            <span class="font-medium text-primary-900 dark:text-primary-100">{balance.balance.name}</span>
                            </div>
                            <div class="text-sm text-primary-700 dark:text-primary-300">
                            {balance.balance.balance.toLocaleString('es-ES', { style: 'currency', currency: 'USD' })}
                            </div>
                            {#if balance.expirationDate}
                            <div class="text-xs text-primary-500 dark:text-primary-400 mt-1">
                                Vence: {formatDate(balance.expirationDate)}
                            </div>
                            {/if}
                            {#if balance.principal}
                            <span class="inline-block bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full mt-1">Principal</span>
                            {/if}
                        </div>
                        {/each}
                    </div>
                    </div>
                {/if}

                <!-- Metadatos -->
                <div class="mt-6 pt-4 border-t border-primary-200/50 dark:border-primary-700/50">
                    <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p class="text-primary-500 dark:text-primary-400">Categoría</p>
                        <p class="text-primary-800 dark:text-primary-200">{selectedLink.category}</p>
                    </div>
                    <div>
                        <p class="text-primary-500 dark:text-primary-400">Creado</p>
                        <p class="text-primary-800 dark:text-primary-200">{formatDate(selectedLink.createdAt)}</p>
                    </div>
                    <div>
                        <p class="text-primary-500 dark:text-primary-400">Actualizado</p>
                        <p class="text-primary-800 dark:text-primary-200">{formatDate(selectedLink.updatedAt)}</p>
                    </div>
                    <div>
                        <p class="text-primary-500 dark:text-primary-400">Última vista</p>
                        <p class="text-primary-800 dark:text-primary-200">{formatDate(selectedLink.lastViewed)}</p>
                    </div>
                    </div>
                </div>
            </div>
        {/if}

        {#if isEdit}
            <button
                type="button"
                class="px-4 mt-6 w-full py-2 bg-primary-800 hover:bg-primary-700 text-white rounded-lg transition-colors"
                on:click={() => isEdit = !isEdit}
            >
                Cancelar
            </button>
        {/if}
    </div>
{/if}

