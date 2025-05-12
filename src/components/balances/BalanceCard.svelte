<script lang="ts">
  // Definición de tipos
  type BalanceCategory = 'bank' | 'cash' | 'card' | 'freelance' | 'investment' | 'savings';

  interface Balance {
    id: number;
    name: string;
    category: BalanceCategory;
    amount: number;
    iban?: string;
    entity?: string;
    brand?: string;
    last4?: string;
    lastUpdate: string;
    description?: string;
  }

  // Props
  export let balance: Balance;
  export let onSelect: (balance: Balance) => void;

  // Estado local
  let isHovered = false;
  
  // Funciones de utilidad
  function getCategoryIcon(category: BalanceCategory) {
    switch (category) {
      case 'cash':
        return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 01-.75.75h-.75m-6-1.5H2.25m19.5 0v.75c0 .414-.336.75-.75.75h-.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 01-.75.75h-.75" />
        </svg>`;
      case 'bank':
        return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
        </svg>`;
      case 'card':
        return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
        </svg>`;
      case 'freelance':
        return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
        </svg>`;
      case 'investment':
        return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>`;
      case 'savings':
        return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
        </svg>`;
      default:
        return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>`;
    }
  }
  
  function getCategoryName(category: BalanceCategory): string {
    switch (category) {
      case 'cash':
        return 'Efectivo';
      case 'bank':
        return 'Cuenta Bancaria';
      case 'card':
        return 'Tarjeta';
      case 'freelance':
        return 'Trabajo Freelance';
      case 'investment':
        return 'Inversión';
      case 'savings':
        return 'Ahorros';
      default:
        return category;
    }
  }
  
  function getCategoryColor(category: BalanceCategory): string {
    switch (category) {
      case 'cash':
        return 'from-green-500 to-green-700';
      case 'bank':
        return 'from-blue-500 to-blue-700';
      case 'card':
        return 'from-purple-500 to-purple-700';
      case 'freelance':
        return 'from-orange-500 to-orange-700';
      case 'investment':
        return 'from-teal-500 to-teal-700';
      case 'savings':
        return 'from-indigo-500 to-indigo-700';
      default:
        return 'from-primary-500 to-primary-700';
    }
  }
  
  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(amount);
  }

  function handleClick() {
    onSelect(balance);
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      onSelect(balance);
    }
  }
</script>

<button 
  class="w-full text-left bg-primary-50/30 dark:bg-primary-800/30 backdrop-blur-xl rounded-xl shadow-lg border border-primary-200/50 dark:border-primary-700/50 overflow-hidden transition-all duration-300 {isHovered ? 'transform scale-[1.02]' : ''}"
  on:mouseenter={() => isHovered = true}
  on:mouseleave={() => isHovered = false}
  on:click={handleClick}
  on:keydown={handleKeyDown}
  aria-label="Ver detalles de {balance.name}"
>
  <div class="h-24 bg-gradient-to-r {getCategoryColor(balance.category)} flex items-center justify-between px-6">
    <div class="text-white">
      <h3 class="text-xl font-bold">{balance.name}</h3>
      <p class="text-white/80 text-sm">{getCategoryName(balance.category)}</p>
    </div>
    <div class="bg-white/20 p-3 rounded-full">
      {@html getCategoryIcon(balance.category)}
    </div>
  </div>
  
  <div class="p-5">
    <div class="flex justify-between items-center mb-3">
      <div class="text-primary-600 dark:text-primary-300 text-sm">Saldo disponible</div>
      <div class="text-2xl font-bold text-primary-900 dark:text-primary-100">{formatCurrency(balance.amount)}</div>
    </div>
    
    {#if balance.category === 'bank' && balance.iban}
      <div class="flex items-center text-primary-600 dark:text-primary-300 text-sm mb-3">
        <span class="mr-2">IBAN:</span>
        <span class="font-mono">{balance.iban}</span>
      </div>
    {/if}
    
    {#if balance.category === 'card' && balance.brand && balance.last4}
      <div class="flex items-center text-primary-600 dark:text-primary-300 text-sm mb-3">
        <span class="mr-2">{balance.brand}:</span>
        <span class="font-mono">**** **** **** {balance.last4}</span>
      </div>
    {/if}
    
    <div class="flex justify-between items-center text-xs text-primary-500 dark:text-primary-400">
      <div>
        {#if balance.lastUpdate}
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Actualizado: {new Date(balance.lastUpdate).toLocaleDateString('es-ES')}</span>
          </div>
        {/if}
      </div>
      
      {#if balance.category === 'bank' && balance.entity}
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          <span>{balance.entity}</span>
        </div>
      {/if}
    </div>
  </div>
</button>
