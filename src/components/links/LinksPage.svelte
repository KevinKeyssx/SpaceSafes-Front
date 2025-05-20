<script lang="ts">
    import { onMount } from 'svelte';

	import { Toaster } from 'svelte-french-toast';

    import LinkList from './LinkList.svelte';
    import Input from '../ui/Inputs/Input.svelte';
    import Combobox from '../ui/Inputs/Combobox.svelte';
    import Switch from '../ui/Inputs/Switch.svelte';
    import Title from '../ui/Title.svelte';
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
    import SpaceLoader from '../loader/SpaceLoader.svelte';


    onMount(async() => {
        if ( $linksStore.length > 0 ) {
            return;
        }

        setIsLoadingLinksStore(true);
        const linkList = await loadSpaceSafes<Link[]>({ url: '/api/space-safes/navly' });

        if ( !linkList ) {
            console.log('🚀 ~ file: LinksPage.svelte:15 ~ linkList:')
            setIsLoadingLinksStore(false);
            return;
        }

        setIsLoadingLinksStore(false);
        setLinks( linkList );
    });
    let open = false;
    let searchTerm = '';
    let categoryFilter = ''; // Stores the selected category value
    let showOnlyFavorites = false;

    // Derive categories for Combobox
    $: uniqueCategories = Array.from(new Set($linksStore.map(link => link.category))).map(cat => ({ value: cat, label: cat || 'Sin Categoría' }));
    $: categoryOptions = [{ value: '', label: 'Todas las categorías' }, ...uniqueCategories];
</script>

<Toaster />

<div class="space-y-6">
    <Title>
        <div slot="title">
            Mis Enlaces Web
        </div>
        <div slot="content">
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
    </Title>

    <div class="flex flex-col gap-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1fr_auto] gap-3 items-center">
            <div class="flex-1 relative w-full">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-primary-500">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                </div>
                <Input
                    type="search"
                    placeholder="Buscar por nombre o URL..."
                    bind:value={searchTerm}
                />
            </div>

            <Combobox
                bind:value={categoryFilter}
                placeholder="Filtrar por categoría"
                options={categoryOptions}
            />

            <Switch
                bind:checked={showOnlyFavorites}
                label="Solo favoritos"
            />
        </div>
    </div>

    {#if $isLoadingLinksStore}
        <div class="flex items-center justify-center h-full">
            <SpaceLoader />
        </div>
    {:else if $errorLinksStore}
        <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            <p>Error al cargar las cuentas. Intente nuevamente más tarde.</p>
        </div>
    {:else if $linksStore }
        <LinkList 
            links={ $linksStore } 
            searchTerm={searchTerm} 
            categoryFilter={categoryFilter} 
            showOnlyFavorites={showOnlyFavorites} 
        />
    {/if}
</div>
