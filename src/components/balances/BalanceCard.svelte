<script lang="ts">
    import type { Balance } from "@/models/balance/balance.model";
    import { TypeBalance } from "@/models/balance/enum/type-balance.enum";
    import PatternBackground from "@/components/ui/PatternBackground.svelte";
    import GlowEffects from "@/components/ui/GlowEffects.svelte";

  export let balance: Balance;

  // Funciones de utilidad
  function getCategoryIcon(category: TypeBalance) {
    switch (category) {
      case TypeBalance.CASH:
        return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 01-.75.75h-.75m-6-1.5H2.25m19.5 0v.75c0 .414-.336.75-.75.75h-.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 01-.75.75h-.75" />
        </svg>`;
      case TypeBalance.BANK_ACCOUNT:
        return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
        </svg>`;
      case TypeBalance.CREDIT:
        return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
        </svg>`;
      case TypeBalance.FREELANCE:
        return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
        </svg>`;
      case TypeBalance.INVESTMENT:
        return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>`;
      case TypeBalance.SAVINGS:
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
  
  function getCategoryName(category: TypeBalance): string {
    switch (category) {
      case TypeBalance.CASH:
        return 'Efectivo';
      case TypeBalance.BANK_ACCOUNT:
        return 'Cuenta Bancaria';
      case TypeBalance.FREELANCE:
        return 'Trabajo Freelance';
      case TypeBalance.INVESTMENT:
        return 'Inversión';
      case TypeBalance.SAVINGS:
        return 'Ahorros';
      default:
        return category;
    }
  }
  
  function getCategoryColor(category: TypeBalance): string {
    switch (category) {
      case TypeBalance.CASH:
        return 'from-green-500 to-green-700';
      case TypeBalance.BANK_ACCOUNT:
        return 'from-blue-500 to-blue-700';
      case TypeBalance.FREELANCE:
        return 'from-purple-500 to-purple-700';
      case TypeBalance.INVESTMENT:
        return 'from-orange-500 to-orange-700';
      case TypeBalance.SAVINGS:
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

</script>

<div
  class="relative w-full text-left bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 backdrop-blur-xl rounded-xl shadow-lg border border-primary-600/30 dark:border-primary-700/50 overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-primary-500/20 group"
>
  <!-- Contenedor interno para el efecto de escala -->
  <div class="absolute inset-0 w-full h-full transition-transform duration-300 group-hover:scale-[1.02] z-0">
    <!-- Elementos decorativos de fondo que se escalan con el contenedor -->
    <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent opacity-40"></div>
    <PatternBackground patternId="balanceGrid-{balance.id}" opacity={5} />
  </div>
  
  <!-- Efectos de brillo que permanecen fijos -->
  <GlowEffects />
  <header class="relative h-24 bg-gradient-to-r {getCategoryColor(balance.type)} flex items-center justify-between px-6 z-10">
    <div class="text-white transition-all duration-300 group-hover:translate-y-[-2px]">
      <h3 class="text-xl font-bold drop-shadow-md">{balance.name}</h3>
      <p class="text-white/80 text-sm">{getCategoryName(balance.type)}</p>
    </div>
    <div class="bg-white/20 p-3 rounded-full shadow-md transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30">
      {@html getCategoryIcon(balance.type)}
    </div>
    <!-- Overlay para suavizar el borde -->
    <div class="absolute inset-0 pointer-events-none shadow-[inset_0_0_10px_rgba(0,0,0,0.2)] group-hover:shadow-[inset_0_0_15px_rgba(0,0,0,0.3)] transition-all duration-300"></div>
  </header>
   <!-- Indicador de acción con mejor estilo y animación -->
   <!-- <div class="absolute -right-1 top-1/2 -translate-y-1/2 z-10">
    <div class="p-2 rounded-l-full bg-primary-500/50 backdrop-blur-md shadow-lg transition-all duration-300 group-hover:bg-primary-400/60 group-hover:translate-x-[-4px] group-hover:shadow-primary-400/30">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </div> -->
  <main class="p-5 z-10 relative">
    
    <!-- Línea divisoria con degradado en la parte superior -->
    <div class="h-px w-full bg-gradient-to-r from-transparent via-primary-400/30 to-transparent mb-3"></div>
    
    <div class="flex justify-between items-center mb-3">
      <div class="text-primary-200 text-sm transition-all duration-300 group-hover:translate-x-1">Saldo disponible</div>
      <div class="text-2xl font-bold text-white drop-shadow-sm transition-all duration-300 group-hover:translate-y-[-2px]">{formatCurrency(balance.balance)}</div>
    </div>
    
    
    {#if balance.type === TypeBalance.BANK_ACCOUNT && balance.accountNumber}
      <div class="flex items-center text-primary-300 text-sm mb-3 transition-all duration-300 group-hover:translate-x-1">
        <span class="mr-2 text-primary-400">IBAN:</span>
        <span class="font-mono">{balance.accountNumber}</span>
      </div>
    {/if}
    
    {#if balance.cardNumber}
      <div class="flex items-center text-primary-300 text-sm mb-3 transition-all duration-300 group-hover:translate-x-1">
        <span class="mr-2 text-primary-400">{balance.typeCard}</span>
        <div class="font-mono items-center flex">
            <span class="mt-1.5 mr-2">**** **** ****</span>
            <span>{balance.cardNumber.slice(-4)}</span>
        </div>
      </div>
    {/if}
    
    <footer class="mt-auto flex justify-between items-center text-xs text-primary-300 bg-primary-600/30 backdrop-blur-sm p-3 -mx-5 -mb-5 border-t border-primary-500/30 z-10 relative">
      <div>
        {#if balance.lastPayment}
          <div class="flex items-center transition-all duration-300 group-hover:translate-y-[-1px]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Utilizada: {new Date(balance.lastPayment).toLocaleDateString('es-ES')}</span>
          </div>
        {/if}
      </div>
      
      {#if balance.bankName}
        <div class="flex items-center transition-all duration-300 group-hover:translate-y-[-1px]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          <span>{balance.bankName}</span>
        </div>
      {/if}
      
     
    </footer>
  </main>
</div>

<style>
  @keyframes pulse-slow {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.8;
    }
  }
  
  .animate-pulse-slow {
    animation: pulse-slow 3s ease-in-out infinite;
  }
</style>
