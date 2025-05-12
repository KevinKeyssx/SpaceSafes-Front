<script lang="ts">
  import PaymentItem from './PaymentItem.svelte';
  import BalanceSelector from './BalanceSelector.svelte';

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
    status: 'pending' | 'paid';
    paymentMethod: PaymentMethod;
    website?: Website;
  }

  interface Balance {
    id: number;
    name: string;
    amount: number;
    category: string;
  }

  // Props
  export let initialPayments: Payment[] = [];
  export let initialBalances: Balance[] = [];

  // Estado
  let payments = initialPayments;
  let balances = initialBalances;
  let selectedBalanceId = initialBalances.length > 0 ? initialBalances[0].id : null;
  let searchPending = '';
  let searchPaid = '';
  let currentMonth = new Date();
  
  // Variables para pagos filtrados
  let pendingItems: Payment[] = [];
  let paidItems: Payment[] = [];

  // Variables para HTML5 Drag and Drop
  let draggedPayment: Payment | null = null;
  let dragOverContainer: string | null = null;



  // Función para filtrar pagos por mes y año
  function filterByMonth(payment: Payment): boolean {
    const paymentDate = new Date(payment.dueDate);
    return paymentDate.getMonth() === currentMonth.getMonth() && 
           paymentDate.getFullYear() === currentMonth.getFullYear();
  }
  
  // Filtrar pagos por estado, búsqueda y mes (reactividad)
  $: {
    const filtered = payments.filter(filterByMonth);
    
    pendingItems = filtered
      .filter(payment => payment.status === 'pending')
      .filter(payment => 
        searchPending === '' || 
        payment.description.toLowerCase().includes(searchPending.toLowerCase()) ||
        payment.recipient.toLowerCase().includes(searchPending.toLowerCase())
      );
    
    paidItems = filtered
      .filter(payment => payment.status === 'paid')
      .filter(payment => 
        searchPaid === '' || 
        payment.description.toLowerCase().includes(searchPaid.toLowerCase()) ||
        payment.recipient.toLowerCase().includes(searchPaid.toLowerCase())
      );
  }
  
  // Calcular totales (reactividad)
  $: pendingTotal = pendingItems.reduce((sum, payment) => sum + payment.amount, 0);
  $: paidTotal = paidItems.reduce((sum, payment) => sum + payment.amount, 0);
  
  // Función para formatear moneda
  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }

  // Funciones para HTML5 Drag and Drop
  function handleDragStart(event: DragEvent, payment: Payment): void {
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('application/json', JSON.stringify(payment));
      draggedPayment = payment;
    }
  }

  function handleDragOver(event: DragEvent, container: string): void {
    event.preventDefault();
    if (dragOverContainer !== container) {
      dragOverContainer = container;
    }
  }

  function handleDragLeave(): void {
    dragOverContainer = null;
  }

  function handleDrop(event: DragEvent, targetStatus: 'pending' | 'paid'): void {
    event.preventDefault();
    if (!draggedPayment) return;

    // Si el pago se está moviendo a otro contenedor, actualiza su estado
    if (draggedPayment.status !== targetStatus) {
      changePaymentStatus(draggedPayment, targetStatus);
    }

    draggedPayment = null;
    dragOverContainer = null;
  }
  
  // Función para cambiar el estado de un pago
  function changePaymentStatus(payment: Payment, newStatus: 'pending' | 'paid'): void {
    if (payment.status === newStatus) return;

    // Actualizar balance
    if (newStatus === 'paid' && payment.status === 'pending') {
      // Restar del balance al pagar
      if (selectedBalanceId) {
        balances = balances.map(balance => 
          balance.id === selectedBalanceId
            ? { ...balance, amount: balance.amount - payment.amount }
            : balance
        );
      }
    } else if (newStatus === 'pending' && payment.status === 'paid') {
      // Sumar al balance al devolver a pendiente
      if (selectedBalanceId) {
        balances = balances.map(balance => 
          balance.id === selectedBalanceId 
            ? { ...balance, amount: balance.amount + payment.amount }
            : balance
        );
      }
    }

    // Actualizar el estado del pago
    payments = payments.map(p => 
      p.id === payment.id
        ? { ...p, status: newStatus }
        : p
    );
  }


  // Función para cambiar de mes
  function changeMonth(increment: number): void {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + increment);
    currentMonth = newDate;
  }
  
  // Formatear el mes y año actual
  function formatMonthYear(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
      month: 'long',
      year: 'numeric'
    }).format(date);
  }
</script>

<div class="space-y-6">
  <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
    <h1 class="text-2xl font-bold text-primary-900 dark:text-primary-100">Gestión de Pagos</h1>
    
    <div class="flex items-center space-x-4">
      <div class="flex items-center bg-primary-50/50 dark:bg-primary-800/50 px-4 py-2 rounded-lg shadow-sm border border-primary-200/50 dark:border-primary-700/50">
        <button 
          on:click={() => changeMonth(-1)}
          class="text-primary-600 dark:text-primary-300 hover:text-primary-800 dark:hover:text-primary-100 p-1"
          aria-label="Mes anterior"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        
        <span class="mx-3 font-medium text-primary-900 dark:text-primary-100 capitalize">
          {formatMonthYear(currentMonth)}
        </span>
        
        <button 
          on:click={() => changeMonth(1)}
          class="text-primary-600 dark:text-primary-300 hover:text-primary-800 dark:hover:text-primary-100 p-1"
          aria-label="Mes siguiente"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
      
      <div class="w-64">
        <BalanceSelector 
          balances={balances} 
          selectedBalanceId={selectedBalanceId} 
          onSelectBalance={(id) => selectedBalanceId = id} 
        />
      </div>
    </div>
  </div>
  
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Columna de pagos pendientes -->
    <div 
      id="pending-container"
      class="bg-primary-50/30 dark:bg-primary-800/30 backdrop-blur-xl rounded-xl shadow-lg border border-primary-200/50 dark:border-primary-700/50 p-4 transition-all {dragOverContainer === 'pending' ? 'bg-blue-100/30 dark:bg-blue-800/20 border-blue-300/50 dark:border-blue-700/50' : ''}"
      on:dragover={(e) => handleDragOver(e, 'pending')}
      on:dragleave={handleDragLeave}
      on:drop={(e) => handleDrop(e, 'pending')}
      role="region"
      aria-label="Pagos pendientes"
    >
      <div class="space-y-3 mb-4">
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-semibold text-primary-900 dark:text-primary-100 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2 text-yellow-500" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Pagos Pendientes
          </h2>
          <span class="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 rounded-full text-sm font-medium">
            {formatCurrency(pendingTotal)}
          </span>
        </div>
        
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-primary-500" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Buscar pagos pendientes..."
            class="w-full pl-10 pr-4 py-2 bg-primary-50/50 dark:bg-primary-800/50 border border-primary-200/50 dark:border-primary-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 text-primary-900 dark:text-primary-100 text-sm"
            bind:value={searchPending}
            aria-label="Buscar pagos pendientes"
          />
        </div>
      </div>
      
      <div class="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
        {#if pendingItems.length === 0}
          <div class="text-center py-8 text-primary-500 dark:text-primary-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 mx-auto mb-2 opacity-50" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
            </svg>
            <p>No hay pagos pendientes</p>
            <p class="text-sm">Arrastra aquí para marcar como pendiente</p>
          </div>
        {:else}
          {#each pendingItems as item (item.id)}
            <div
              class="cursor-move hover:scale-[1.01] transition-transform"
              draggable="true"
              on:dragstart={(e) => handleDragStart(e, item)}
            >
              <PaymentItem 
                payment={item} 
                isDragging={draggedPayment === item}
                onDragStart={() => {}}
              />
            </div>
          {/each}
        {/if}
      </div>
    </div>
    
    <div class="space-y-6">
      <!-- Sección de pagos realizados -->
      <div 
        id="paid-container"
        class="bg-primary-50/30 dark:bg-primary-800/30 backdrop-blur-xl rounded-xl shadow-lg border border-primary-200/50 dark:border-primary-700/50 p-4 transition-all {dragOverContainer === 'paid' ? 'bg-blue-100/30 dark:bg-blue-800/20 border-blue-300/50 dark:border-blue-700/50' : ''}"
        on:dragover={(e) => handleDragOver(e, 'paid')}
        on:dragleave={handleDragLeave}
        on:drop={(e) => handleDrop(e, 'paid')}
        role="region"
        aria-label="Pagos realizados"
      >
        <div class="space-y-3 mb-4">
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-semibold text-primary-900 dark:text-primary-100 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2 text-green-500" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Pagos Realizados
            </h2>
            <span class="px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
              {formatCurrency(paidTotal)}
            </span>
          </div>
          
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-primary-500" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Buscar pagos realizados..."
              class="w-full pl-10 pr-4 py-2 bg-primary-50/50 dark:bg-primary-800/50 border border-primary-200/50 dark:border-primary-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 text-primary-900 dark:text-primary-100 text-sm"
              bind:value={searchPaid}
              aria-label="Buscar pagos realizados"
            />
          </div>
        </div>
          
        <div class="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
          {#if paidItems.length === 0}
            <div class="text-center py-6 text-primary-500 dark:text-primary-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 mx-auto mb-2 opacity-50" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 01-.75.75h-.75m-6-1.5H2.25m19.5 0v.75c0 .414-.336.75-.75.75h-.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 01-.75.75h-.75" />
              </svg>
              <p>No hay pagos realizados</p>
              <p class="text-sm">Arrastra aquí para marcar como pagado</p>
            </div>
          {:else}
            {#each paidItems as item (item.id)}
              <div
                class="cursor-move hover:scale-[1.01] transition-transform"
                draggable="true"
                on:dragstart={(e) => handleDragStart(e, item)}
              >
                <PaymentItem 
                  payment={item} 
                  isDragging={draggedPayment === item}
                  onDragStart={() => {}}
                />
              </div>
            {/each}
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>
