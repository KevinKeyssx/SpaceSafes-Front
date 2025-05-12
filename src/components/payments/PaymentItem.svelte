<script lang="ts">
  // Definición de tipos
  interface PaymentMethod {
    type: string;
    brand?: string;
    last4?: string;
    name?: string;
  }

  interface Website {
    url: string;
    name: string;
  }

  interface Payment {
    id: number;
    description: string;
    recipient: string;
    amount: number;
    dueDate: string;
    status: 'pending' | 'paid' | 'declined';
    paymentMethod: PaymentMethod;
    website?: Website;
  }

  // Props
  export let payment: Payment;
  export let isDragging: boolean = false;
  export let onDragStart: (e: DragEvent, payment: Payment) => void;

  // Estado
  let isHovered = false;
  
  // Métodos
  function getStatusClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700';
      case 'paid':
        return 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700';
      case 'declined':
        return 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700';
      default:
        return 'bg-primary-100 dark:bg-primary-800/30 border-primary-300 dark:border-primary-700';
    }
  }

  function getStatusTextClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'text-yellow-700 dark:text-yellow-300';
      case 'paid':
        return 'text-green-700 dark:text-green-300';
      case 'declined':
        return 'text-red-700 dark:text-red-300';
      default:
        return 'text-primary-700 dark:text-primary-300';
    }
  }

  function getStatusText(status: string): string {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'paid':
        return 'Pagado';
      case 'declined':
        return 'Rechazado';
      default:
        return status;
    }
  }

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(amount);
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }

  function handleDragStart(e: DragEvent): void {
    onDragStart(e, payment);
  }
</script>

<div
  class={`p-4 rounded-lg border ${getStatusClass(payment.status)} transition-all duration-300 cursor-move ${isHovered ? 'shadow-lg scale-[1.02]' : 'shadow'} ${isDragging ? 'opacity-50' : 'opacity-100'}`}
  on:mouseenter={() => isHovered = true}
  on:mouseleave={() => isHovered = false}
  draggable={true}
  on:dragstart={handleDragStart}
  role="article"
  aria-label={`Pago ${payment.description}`}
>
  <div class="flex justify-between items-start mb-3">
    <div>
      <h3 class="font-semibold text-primary-900 dark:text-primary-100">{payment.description}</h3>
      <p class="text-sm text-primary-600 dark:text-primary-300">{payment.recipient}</p>
    </div>
    <span class={`px-2 py-1 rounded-full text-xs font-medium ${getStatusTextClass(payment.status)}`}>
      {getStatusText(payment.status)}
    </span>
  </div>
  
  <div class="flex justify-between items-center mb-3">
    <div class="flex items-center">
      <div class="w-8 h-8 rounded-full overflow-hidden mr-2 bg-primary-200 dark:bg-primary-700 flex items-center justify-center">
        {#if payment.paymentMethod.type === 'card'}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-primary-700 dark:text-primary-300" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
          </svg>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-primary-700 dark:text-primary-300" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
          </svg>
        {/if}
      </div>
      <div>
        <p class="text-xs text-primary-600 dark:text-primary-300">
          {#if payment.paymentMethod.type === 'card'}
            {payment.paymentMethod.brand} ****{payment.paymentMethod.last4}
          {:else}
            {payment.paymentMethod.name}
          {/if}
        </p>
      </div>
    </div>
    <span class="text-lg font-bold text-primary-900 dark:text-primary-100">{formatCurrency(payment.amount)}</span>
  </div>
  
  <div class="flex justify-between items-center text-xs text-primary-500 dark:text-primary-400">
    <div class="flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
      <span>Vencimiento: {formatDate(payment.dueDate)}</span>
    </div>
    
    {#if payment.website}
      <a 
        href={payment.website.url} 
        target="_blank" 
        rel="noopener noreferrer"
        class="flex items-center text-primary-600 dark:text-primary-300 hover:underline"
        on:click|stopPropagation
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
        </svg>
        {payment.website.name}
      </a>
    {/if}
  </div>
</div>
