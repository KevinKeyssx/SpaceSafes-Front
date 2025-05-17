<script lang="ts">
    import { onMount } from 'svelte';

    import LinkList from './LinkList.svelte';
    import { loadSpaceSafes } from '@/services/fetch/getSpaceSafes';
    import type {  Link, LinkSave } from '@/models/links/link.model';
    import {
        linksStore,
        setLinks,
        isLoadingLinksStore,
        errorLinksStore,
        setIsLoadingLinksStore
    } from '@/stores/linksStore';
    import Dialog from '../ui/bits/Dialog.svelte';
    import LinkForm from './LinkForm.svelte';


    onMount(async() => {
        if ( $linksStore.length > 0 ) {
            return;
        }

        setIsLoadingLinksStore(true);
        const linkList = await loadSpaceSafes<Link[]>({ url: '/api/space-safes/navly' });

        if (  linkList === null ) {
            console.log('🚀 ~ file: LinksPage.svelte:15 ~ linkList:')
            setIsLoadingLinksStore(false);
            return;
        }

        setIsLoadingLinksStore(false);
        setLinks( linkList );
    });
    let open = false
</script>

<div>
    <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-primary-900 dark:text-primary-100">Mis Enlaces Web</h1>

        <Dialog
            buttonText="Añadir Enlace"
            bind:open={open}
        >
            {#snippet iconButton()}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-dasharray="16" stroke-dashoffset="16" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M5 12h14"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="16;0"/></path><path d="M12 5v14"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.4s" values="16;0"/></path></g></svg>
            {/snippet}

            {#snippet title()}
                Añadir Enlace
            {/snippet}

            <LinkForm link={{} as LinkSave} bind:open={open}/>
        </Dialog>       
    </div>

    {#if $isLoadingLinksStore}
        <div class="flex justify-center items-center p-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            <span class="ml-2">Cargando enlaces...</span>
        </div>
    {:else if $errorLinksStore}
        <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            <p>Error al cargar las cuentas. Intente nuevamente más tarde.</p>
        </div>
    {:else if $linksStore }
        <LinkList links={ $linksStore } />
    {/if}
</div>
