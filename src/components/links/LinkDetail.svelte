<script lang="ts">
  import { onMount } from 'svelte';

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
  export let selectedLink: Link | null = null;

  // Estado
  let isVisible = false;
  
  // Reactividad
  $: if (selectedLink) {
    isVisible = true;
  }

  // Función para renderizar las estrellas
  function renderStars(rating: number) {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(`
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-yellow-500">
            <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
          </svg>
        `);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(`
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-yellow-500">
            <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
          </svg>
        `);
      } else {
        stars.push(`
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-400">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
        `);
      }
    }
    
    return stars.join('');
  }
</script>

{#if !selectedLink}
  <div class="h-full flex items-center justify-center p-6 bg-primary-50/30 dark:bg-primary-800/30 backdrop-blur-xl rounded-xl shadow-lg border border-primary-200/50 dark:border-primary-700/50">
    <p class="text-primary-600 dark:text-primary-300 text-center">
      Selecciona un link para ver sus detalles
    </p>
  </div>
{:else}
  <div class="h-full overflow-auto bg-primary-50/30 dark:bg-primary-800/30 backdrop-blur-xl rounded-xl shadow-lg border border-primary-200/50 dark:border-primary-700/50 transition-all duration-300 {isVisible ? 'opacity-100' : 'opacity-0'}">
    <div class="relative">
      <img 
        src={selectedLink.image} 
        alt={selectedLink.title} 
        class="w-full h-48 object-cover"
      />
      <div class="absolute top-4 right-4">
        <a 
          href={selectedLink.url} 
          target="_blank" 
          rel="noopener noreferrer"
          class="bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-full transition-colors duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
          <span class="sr-only">Abrir enlace en nueva pestaña</span>
        </a>
      </div>
    </div>
    
    <div class="p-6">
      <h2 class="text-2xl font-bold text-primary-900 dark:text-primary-100 mb-2">
        {selectedLink.title}
      </h2>
      
      <div class="flex items-center space-x-1 mb-4">
        {@html renderStars(selectedLink.rating)}
        <span class="text-primary-700 dark:text-primary-200 ml-2">{selectedLink.rating.toFixed(1)}</span>
      </div>
      
      <div class="mb-4">
        <div class="flex items-center text-primary-700 dark:text-primary-200 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
          </svg>
          <a href={selectedLink.url} target="_blank" rel="noopener noreferrer" class="text-primary-600 dark:text-primary-300 hover:underline break-all">
            {selectedLink.url}
          </a>
        </div>
        
        <div class="flex items-center text-primary-700 dark:text-primary-200 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z" />
          </svg>
          <span>{selectedLink.category}</span>
        </div>
        
        <div class="flex items-center text-primary-700 dark:text-primary-200 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Última visita: {selectedLink.lastVisited}</span>
        </div>
      </div>
      
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-primary-800 dark:text-primary-200 mb-2">Descripción</h3>
        <p class="text-primary-700 dark:text-primary-300">
          {selectedLink.description}
        </p>
      </div>
      
      {#if selectedLink.tags && selectedLink.tags.length > 0}
        <div>
          <h3 class="text-lg font-semibold text-primary-800 dark:text-primary-200 mb-2">Etiquetas</h3>
          <div class="flex flex-wrap gap-2">
            {#each selectedLink.tags as tag, index}
              <span 
                class="px-3 py-1 bg-primary-100 dark:bg-primary-700 text-primary-700 dark:text-primary-200 rounded-full text-sm"
              >
                {tag}
              </span>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}
