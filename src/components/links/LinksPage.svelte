<script lang="ts">
  import { onMount } from 'svelte';
  import LinkList from './LinkList.svelte';
  import LinkDetail from './LinkDetail.svelte';

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

  // Estado
  let selectedLink: Link | null = null;

  // Inicializar el link seleccionado con el primero de la lista si existe
  onMount(() => {
    if (links.length > 0) {
      selectedLink = links[0];
    }
  });

  // Manejador para seleccionar un link
  function handleSelectLink(link: Link) {
    selectedLink = link;
  }
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
  
  <div class="flex flex-col lg:flex-row gap-6">
    <div class="lg:flex-1">
      <LinkList links={links} onSelectLink={handleSelectLink} />
    </div>
    <div class="lg:w-96">
      <LinkDetail selectedLink={selectedLink} />
    </div>
  </div>
</div>
