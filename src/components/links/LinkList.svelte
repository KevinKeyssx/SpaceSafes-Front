<script lang="ts">
    import type { Link } from '@/models/links/link.model';
    import LinkCard from './LinkCard.svelte';
    import LinkDetail from './LinkDetail.svelte';

    // Props
    export let links: Link[] = [];
    export let searchTerm: string = '';
    export let categoryFilter: string = '';
    export let showOnlyFavorites: boolean = false;

    // Estado
    let selectedLink: Link | null = null;

    // Manejar selección de link
    function handleSelectLink(link: Link) {
        selectedLink = link;
    }


  // Filtrar links por búsqueda, categoría y favoritos
    $: filteredLinks = links.filter(link => {
        // Favoritos
        const favoriteMatch = !showOnlyFavorites || link.isFavorite;
        if (!favoriteMatch) return false;

        // Categoría
        const categoryMatch = !categoryFilter || !link.category || link.category.toLowerCase() === categoryFilter.toLowerCase();
        if (!categoryMatch) return false;

        // Término de búsqueda (nombre o URL)
        const term = searchTerm.toLowerCase().trim();
        const nameMatch = link.name && link.name.toLowerCase().includes(term);
        const urlMatch = link.url && link.url.toLowerCase().includes(term);
        const searchMatch = !term || nameMatch || urlMatch;
        
        return searchMatch; // Si llega hasta aquí, todas las condiciones previas se cumplieron
    });
</script>

<div class="flex flex-col lg:flex-row gap-4">
    <!-- Lista de enlaces (responsiva) -->
    <div class="w-full lg:w-3/4">
        <!-- Lista de enlaces -->
        {#if filteredLinks.length === 0}
            <div class="p-8 text-center bg-primary-50/30 dark:bg-primary-800/30 backdrop-blur-xl rounded-xl shadow-lg border border-primary-200/50 dark:border-primary-700/50">
                <p class="text-primary-600 dark:text-primary-300">
                    {#if searchTerm && categoryFilter}
                        No se encontraron links con "{searchTerm}" en la categoría {categoryFilter}
                    {:else if searchTerm}
                        No se encontraron links que contengan "{searchTerm}"
                    {:else if categoryFilter}
                        No se encontraron links en la categoría {categoryFilter}
                    {:else}
                        No se encontraron links
                    {/if}
                </p>
            </div>
        {:else}
            <!-- Grid de tarjetas responsivo -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
                {#each filteredLinks as link (link.id)}
                    <div 
                        on:click={() => handleSelectLink(link)}
                        on:keydown={(e) => e.key === 'Enter' && handleSelectLink(link)}
                        role="button"
                        tabindex="0"
                        class="cursor-pointer hover:bg-primary-50 dark:hover:bg-primary-800/50 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-primary-900"
                        aria-label={`Ver detalles de ${link.name || 'enlace'}`}
                    >
                        <LinkCard link={link} />
                    </div>
                {/each}
            </div>
        {/if}
    </div>
    
    <!-- Panel de detalles (fijo en scroll) -->
    <div class="w-full lg:w-[70%] xl:w-[30%] 2xl:w-[25%] md:sticky md:top-20 md:self-start">
        <LinkDetail selectedLink={selectedLink} />
    </div>
</div>
