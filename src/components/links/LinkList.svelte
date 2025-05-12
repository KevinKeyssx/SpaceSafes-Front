<script lang="ts">
  import LinkCard from './LinkCard.svelte';

  // Definición de tipos
  interface Link {
    id: number;
    title: string;
    url: string;
    description: string;
    image: string;
    rating: number;
    category: string;
    lastVisited: string;
    tags?: string[];
  }

  // Props
  export let links: Link[] = [];
  export let onSelectLink: (link: Link) => void;

  // Estado
  let searchTerm = '';
  let categoryFilter = '';
  
  // Extraer categorías únicas para el filtro
  $: categories = [...new Set(links.map(link => link.category))];
  
  // Filtrar links por búsqueda y categoría
  $: filteredLinks = links.filter(link => {
    const matchesSearch = searchTerm === '' || 
      link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.url.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === '' || link.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
</script>

<div class="space-y-6">
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
  
  {#if filteredLinks.length === 0}
    <div class="p-8 text-center bg-primary-50/30 dark:bg-primary-800/30 backdrop-blur-xl rounded-xl shadow-lg border border-primary-200/50 dark:border-primary-700/50">
      <p class="text-primary-600 dark:text-primary-300">No se encontraron links que coincidan con tu búsqueda</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filteredLinks as link (link.id)}
        <LinkCard 
          link={link} 
          onSelect={onSelectLink} 
        />
      {/each}
    </div>
  {/if}
</div>
