<script lang="ts">
    import type { Link, LinkSave } from '@/models/links/link.model';
    import { TypeBalance } from '@/models/balance/enum/type-balance.enum';
    import LinkForm from './LinkForm.svelte';
    import Dialog from '../ui/bits/Dialog.svelte';
    import { loadSpaceSafes } from '@/services/fetch/getSpaceSafes';
    import { deleteLink } from '@/stores/linksStore';


    export let selectedLink: Link | null = null;

    const noImage = 'https://res.cloudinary.com/dbgzsikcs/image/upload/v1747376624/sample/3f68b623-b1d4-48a8-bd3f-6a7c3fce6397.avif'


    function getBalanceIcon(type: TypeBalance): string {
        switch (type) {
        case 'CREDIT':
            return 'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5z';
        case 'DEBIT':
            return 'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
        case 'BANK_ACCOUNT':
            return 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z';
        case 'CASH':
            return 'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z';
        case 'FREELANCE':
            return 'M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z';
        case 'SAVINGS':
            return 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z';
        case 'INVESTMENT':
            return 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z';
        default:
            return 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z';
        }
    }


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


    $: if ( selectedLink ) {
        isVisible = true;
    }


    let isEdit = false;


    function linkToLinkSave( link: Link): LinkSave {
        return {
            id: link.id,
            name: link.name || '',
            avatar: link.avatar || '',
            description: link.description || '',
            url: link.url,
            category: link.category,
            isFavorite: link.isFavorite,
            balanceIds: link.navlyBalances?.map(balance => balance.id) || []
        };
    }


    async function confirmDelete(): Promise<void> {
        if (!selectedLink) return;

        const deletedLink = await loadSpaceSafes<Link>({
            url: `/api/space-safes/navly/${selectedLink.id}`,
            method: 'DELETE'
        });

        console.log('🚀 ~ file: AccountForm.svelte:53 ~ savedAccount:', deletedLink)

        if ( deletedLink ) {
            deleteLink( selectedLink.id );
            openDelete = false;
            selectedLink = null;
        }
    }
</script>

{#if !selectedLink}
    <div class="flex items-center justify-center p-6 bg-primary-50/30 dark:bg-primary-800/30 backdrop-blur-xl rounded-xl shadow-lg border border-primary-200/50 dark:border-primary-700/50 h-[400px]">
        <p class="text-primary-600 dark:text-primary-300 text-center">
            Selecciona un enlace para ver sus detalles
        </p>
    </div>
{:else}
    <div class="bg-primary-50/30 dark:bg-primary-800/30 backdrop-blur-xl rounded-xl shadow-lg border border-primary-200/50 dark:border-primary-700/50 transition-all duration-300 {isVisible ? 'opacity-100' : 'opacity-0'} sticky top-4 max-h-[calc(100vh-120px)] overflow-auto">
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
                <Dialog
                    openButtonClass= "bg-primary-700 hover:bg-red-700 p-1 rounded-lg transition-colors duration-300"
                    bind:open={openDelete}
                >
                    {#snippet iconButton()}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="24" stroke-dashoffset="24" d="M12 20h5c0.5 0 1 -0.5 1 -1v-14M12 20h-5c-0.5 0 -1 -0.5 -1 -1v-14"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="24;0"/></path><path stroke-dasharray="20" stroke-dashoffset="20" d="M4 5h16"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.2s" values="20;0"/></path><path stroke-dasharray="8" stroke-dashoffset="8" d="M10 4h4M10 9v7M14 9v7"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="8;0"/></path></g></svg>
                    {/snippet}

                    {#snippet title()}
                        Eliminar Enlace
                    {/snippet}

                    <div class="space-y-2 w-full">
                        <p class="text-primary-200 grid text-center">¿Estás seguro de eliminar el enlace?
                            <span class="text-primary-500">
                                Esta acción no se puede deshacer.
                            </span>
                        </p>
                        <button 
                        type="button" 
                        on:click={confirmDelete}
                        class="mx-auto gap-2 flex justify-center px-4 py-1 w-48 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="24" stroke-dashoffset="24" d="M12 20h5c0.5 0 1 -0.5 1 -1v-14M12 20h-5c-0.5 0 -1 -0.5 -1 -1v-14"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="24;0"/></path><path stroke-dasharray="20" stroke-dashoffset="20" d="M4 5h16"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.2s" values="20;0"/></path><path stroke-dasharray="8" stroke-dashoffset="8" d="M10 4h4M10 9v7M14 9v7"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="8;0"/></path></g></svg>
                            Eliminar Enlace
                        </button>
                    </div>
                </Dialog>
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
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2 text-primary-600 dark:text-primary-300">
                    <path stroke-linecap="round" stroke-linejoin="round" d={getBalanceIcon(balance.balance.type)} />
                </svg>
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

