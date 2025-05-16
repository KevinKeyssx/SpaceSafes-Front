<script lang="ts">
    import { onMount } from 'svelte';

    import LinkList from './LinkList.svelte';
    import { loadSpaceSafes } from '@/services/fetch/getSpaceSafes';
    import type { Link } from '@/models/links/link.model';
    import {
        linksStore,
        setLinks,
        isLoadingLinksStore,
        errorLinksStore,
        setIsLoadingLinksStore
    } from '@/stores/linksStore';


    onMount(async() => {
        if ( $linksStore.length > 0 ) {
            return;
        }

        setIsLoadingLinksStore(true);
        const linkList = await loadSpaceSafes<Link[]>( [], '/api/space-safes/navly' );

        if (  linkList === null ) {
            console.log('🚀 ~ file: LinksPage.svelte:15 ~ linkList:')
            setIsLoadingLinksStore(false);
            return;
        }

        setIsLoadingLinksStore(false);
        setLinks( linkList );
    });
</script>

<div class="space-y-6">
    <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-primary-900 dark:text-primary-100">Mis Enlaces Web</h1>

        <button 
            class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-300 flex items-center space-x-2"
            aria-label="Añadir nuevo enlace"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>

            <span>Añadir Enlace</span>
        </button>
    </div>

    {#if $isLoadingLinksStore}
        <div class="flex justify-center items-center p-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            <span class="ml-2">Cargando enlaces...</span>
        </div>
    {:else if $errorLinksStore}
        <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            <!-- <p>Error al cargar las cuentas. {$errorAccounts.message || 'Intente nuevamente más tarde.'}</p> -->
            <p>Error al cargar las cuentas.  Intente nuevamente más tarde.</p>
            <!-- <button 
                class="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                on:click={reloadAccounts}
            >
                Reintentar
            </button> -->
        </div>
    {:else if $linksStore }
        <div class="flex space-x-6">
            <div class="flex-1">
                <LinkList links={ $linksStore } />
            </div>
        </div>
    {/if}
</div>
