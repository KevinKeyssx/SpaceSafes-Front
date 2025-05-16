<script lang="ts">
    import type { Link } from '@/models/links/link.model';
    import LinkCard from './LinkCard.svelte';
    import LinkDetail from './LinkDetail.svelte';

    // Props
    export let links: Link[] = [];

    // Estado
    let searchTerm = '';
    let categoryFilter = '';
    let selectedLink: Link | null = null;

    // Manejar selección de link
    function handleSelectLink(link: Link) {
        selectedLink = link;
    }

  // Extraer categorías únicas para el filtro
    $: categories = [...new Set(links.map(link => link.category))];

  // Filtrar links por búsqueda y categoría
    $: filteredLinks = links.filter(link => {
        const matchesSearch = searchTerm === '' || 
            (link.name && link.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (link.url && link.url.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesCategory = categoryFilter === '' || link.category === categoryFilter;
        
        return matchesSearch && matchesCategory;
    });
</script>

<div class="flex gap-6">
  <div class="flex-1 space-y-6">
    <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1 relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-primary-500" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
        </div>
        <input
            type="text"
            placeholder="Buscar links..."
            class="w-full pl-10 pr-4 py-2 bg-primary-50/50 dark:bg-primary-800/50 border border-primary-200/50 dark:border-primary-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 text-primary-900 dark:text-primary-100"
            bind:value={searchTerm}
            aria-label="Buscar enlaces"
        />
        </div>
        
        <select
        class="px-4 py-2 bg-primary-50/50 dark:bg-primary-800/50 border border-primary-200/50 dark:border-primary-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 text-primary-900 dark:text-primary-100"
        bind:value={categoryFilter}
        aria-label="Filtrar por categoría"
        >
        <option value="">Todas las categorías</option>
        {#each categories as category, index}
            <option value={category}>{category}</option>
        {/each}
        </select>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    {/if}
  </div>
  
  <!-- Detalle del link -->
  <div class="w-96 flex-shrink-0 hidden lg:block self-start sticky top-4">
    <LinkDetail selectedLink={selectedLink} />
  </div>
</div>
