<script lang="ts">
  import type { Link } from '@/models/links/link.model';
  import { TypeBalance } from '@/models/balance/enum/type-balance.enum';
  import { fade } from 'svelte/transition';

  // Props
  export let selectedLink: Link | null = null;
  
  // Función para obtener el ícono según el tipo de balance
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
  
  // Función para formatear la fecha
  function formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  }

  // Estado
  let isVisible = false;
  
  // Reactividad
  $: if (selectedLink) {
    isVisible = true;
  }
</script>

{#if !selectedLink}
  <div class="flex items-center justify-center p-6 bg-primary-50/30 dark:bg-primary-800/30 backdrop-blur-xl rounded-xl shadow-lg border border-primary-200/50 dark:border-primary-700/50">
    <p class="text-primary-600 dark:text-primary-300 text-center">
      Selecciona un enlace para ver sus detalles
    </p>
  </div>
{:else}
  <div class="overflow-auto bg-primary-50/30 dark:bg-primary-800/30 backdrop-blur-xl rounded-xl shadow-lg border border-primary-200/50 dark:border-primary-700/50 transition-all duration-300 {isVisible ? 'opacity-100' : 'opacity-0'}">
    <!-- Header con imagen -->
    <div class="relative">
      {#if selectedLink.avatar}
        <img 
          src={selectedLink.avatar} 
          alt={selectedLink.name || 'Imagen del enlace'} 
          class="w-full h-48 object-cover"
        />
      {:else}
        <div class="w-full h-48 bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
          <span class="text-4xl text-white font-bold">
            {selectedLink.name ? selectedLink.name.charAt(0).toUpperCase() : 'L'}
          </span>
        </div>
      {/if}
      
      {#if selectedLink.isFavorite}
        <div class="absolute top-2 right-2 z-20 text-yellow-400">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
            <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
          </svg>
        </div>
      {/if}
      
      <div class="absolute bottom-2 right-2">
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
      </div>
    </div>
    
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
  </div>
{/if}
