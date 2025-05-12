<script lang="ts">
  import { onMount } from 'svelte';
  import BalanceCard from './BalanceCard.svelte';
  import AddBalanceForm from './AddBalanceForm.svelte';

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
  export let initialBalances: Balance[] = [];

  // Estado local
  let balances: Balance[] = [];
  let selectedBalance: Balance | null = null;
  let showAddForm = false;
  let searchTerm = '';
  let categoryFilter = '';
  
  // Inicializar balances con los valores iniciales
  onMount(() => {
    balances = initialBalances;
  });
  
  // Calcular el total de todos los balances
  $: totalBalance = balances.reduce((sum, balance) => sum + balance.amount, 0);
  
  // Filtrar balances por búsqueda y categoría
  $: filteredBalances = balances.filter(balance => {
    const matchesSearch = searchTerm === '' || 
      balance.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (balance.description && balance.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === '' || balance.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  // Manejar la adición de un nuevo balance
  function handleAddBalance(newBalance: any) {
    // Asegurarse de que amount sea un número
    const processedBalance: Balance = {
      ...newBalance,
      amount: typeof newBalance.amount === 'string' ? parseFloat(newBalance.amount) : newBalance.amount
    };
    balances = [...balances, processedBalance];
    showAddForm = false;
  }
  
  // Manejar la selección de un balance
  function handleSelectBalance(balance: Balance) {
    selectedBalance = balance;
  }
  
  // Formatear moneda
  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(amount);
  }

  // Cerrar el modal de detalles
  function closeModal() {
    selectedBalance = null;
  }

  // Manejar eventos de teclado para accesibilidad
  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape' && selectedBalance) {
      closeModal();
    }
  }
</script>

<svelte:window on:keydown={handleKeyDown} />

<div class="space-y-6">
  <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
    <h1 class="text-2xl font-bold text-primary-900 dark:text-primary-100">Mis Balances</h1>
    
    <div class="bg-primary-50/50 dark:bg-primary-800/50 px-6 py-3 rounded-lg shadow-sm border border-primary-200/50 dark:border-primary-700/50">
      <div class="text-sm text-primary-600 dark:text-primary-300">Balance total</div>
      <div class="text-2xl font-bold text-primary-900 dark:text-primary-100">{formatCurrency(totalBalance)}</div>
    </div>
  </div>
  
  <div class="flex flex-col md:flex-row gap-4">
    <div class="flex-1 relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-primary-500">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </div>
      <input
        type="text"
        placeholder="Buscar balances..."
        class="w-full pl-10 pr-4 py-2 bg-primary-50/50 dark:bg-primary-800/50 border border-primary-200/50 dark:border-primary-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 text-primary-900 dark:text-primary-100"
        bind:value={searchTerm}
      />
    </div>
    
    <select
      class="px-4 py-2 bg-primary-50/50 dark:bg-primary-800/50 border border-primary-200/50 dark:border-primary-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 text-primary-900 dark:text-primary-100"
      bind:value={categoryFilter}
    >
      <option value="">Todas las categorías</option>
      <option value="bank">Cuentas Bancarias</option>
      <option value="cash">Efectivo</option>
      <option value="card">Tarjetas</option>
      <option value="freelance">Trabajos Freelance</option>
      <option value="investment">Inversiones</option>
      <option value="savings">Ahorros</option>
    </select>
    
    <button
      on:click={() => showAddForm = true}
      class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center space-x-2"
      on:keydown={(e) => e.key === 'Enter' && (showAddForm = true)}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
      <span>Añadir Balance</span>
    </button>
  </div>
  
  {#if showAddForm}
    <AddBalanceForm 
      onAdd={handleAddBalance} 
      onCancel={() => showAddForm = false} 
    />
  {:else}
    {#if filteredBalances.length === 0}
      <div class="p-8 text-center bg-primary-50/30 dark:bg-primary-800/30 backdrop-blur-xl rounded-xl shadow-lg border border-primary-200/50 dark:border-primary-700/50">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 mx-auto mb-3 text-primary-400">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 01-.75.75h-.75m-6-1.5H2.25m19.5 0v.75c0 .414-.336.75-.75.75h-.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 01-.75.75h-.75" />
        </svg>
        <p class="text-primary-600 dark:text-primary-300 mb-2">No se encontraron balances</p>
        <p class="text-primary-500 dark:text-primary-400 text-sm">
          {searchTerm || categoryFilter 
            ? 'Prueba con otros criterios de búsqueda o añade un nuevo balance' 
            : 'Comienza añadiendo tu primer balance'}
        </p>
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each filteredBalances as balance (balance.id)}
          <BalanceCard 
            {balance} 
            onSelect={handleSelectBalance}
          />
        {/each}
      </div>
    {/if}
  {/if}
  
  {#if selectedBalance}
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-primary-50/90 dark:bg-primary-800/90 backdrop-blur-xl rounded-xl shadow-xl border border-primary-200/50 dark:border-primary-700/50 max-w-lg w-full p-6 max-h-[90vh] overflow-auto">
        <div class="flex justify-between items-start mb-4">
          <h2 class="text-xl font-bold text-primary-900 dark:text-primary-100">Detalles del Balance</h2>
          <button 
            on:click={closeModal}
            class="text-primary-500 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-200"
            on:keydown={(e) => e.key === 'Enter' && closeModal()}
            aria-label="Cerrar detalles"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="space-y-4">
          <div class={`h-24 bg-gradient-to-r ${
            selectedBalance.category === 'cash' ? 'from-green-500 to-green-700' :
            selectedBalance.category === 'bank' ? 'from-blue-500 to-blue-700' :
            selectedBalance.category === 'card' ? 'from-purple-500 to-purple-700' :
            selectedBalance.category === 'freelance' ? 'from-orange-500 to-orange-700' :
            selectedBalance.category === 'investment' ? 'from-teal-500 to-teal-700' :
            selectedBalance.category === 'savings' ? 'from-indigo-500 to-indigo-700' :
            'from-primary-500 to-primary-700'
          } flex items-center justify-center rounded-lg mb-4`}>
            <div class="text-center text-white">
              <h3 class="text-2xl font-bold">{selectedBalance.name}</h3>
              <p class="text-white/80">
                {selectedBalance.category === 'cash' ? 'Efectivo' :
                 selectedBalance.category === 'bank' ? 'Cuenta Bancaria' :
                 selectedBalance.category === 'card' ? 'Tarjeta' :
                 selectedBalance.category === 'freelance' ? 'Trabajo Freelance' :
                 selectedBalance.category === 'investment' ? 'Inversión' :
                 selectedBalance.category === 'savings' ? 'Ahorros' :
                 selectedBalance.category}
              </p>
            </div>
          </div>
          
          <div class="bg-primary-100/50 dark:bg-primary-700/30 p-4 rounded-lg">
            <div class="text-sm text-primary-600 dark:text-primary-300">Saldo disponible</div>
            <div class="text-3xl font-bold text-primary-900 dark:text-primary-100">{formatCurrency(selectedBalance.amount)}</div>
          </div>
          
          <div class="grid grid-cols-1 gap-3">
            {#if selectedBalance.category === 'bank' && selectedBalance.iban}
              <div>
                <div class="text-sm text-primary-600 dark:text-primary-300">IBAN</div>
                <div class="font-mono text-primary-900 dark:text-primary-100">{selectedBalance.iban}</div>
              </div>
            {/if}
            
            {#if selectedBalance.category === 'bank' && selectedBalance.entity}
              <div>
                <div class="text-sm text-primary-600 dark:text-primary-300">Entidad bancaria</div>
                <div class="text-primary-900 dark:text-primary-100">{selectedBalance.entity}</div>
              </div>
            {/if}
            
            {#if selectedBalance.category === 'card' && selectedBalance.brand && selectedBalance.last4}
              <div>
                <div class="text-sm text-primary-600 dark:text-primary-300">Tarjeta</div>
                <div class="text-primary-900 dark:text-primary-100">
                  {selectedBalance.brand} **** **** **** {selectedBalance.last4}
                </div>
              </div>
            {/if}
            
            {#if selectedBalance.description}
              <div>
                <div class="text-sm text-primary-600 dark:text-primary-300">Descripción</div>
                <div class="text-primary-900 dark:text-primary-100">{selectedBalance.description}</div>
              </div>
            {/if}
            
            {#if selectedBalance.lastUpdate}
              <div>
                <div class="text-sm text-primary-600 dark:text-primary-300">Última actualización</div>
                <div class="text-primary-900 dark:text-primary-100">
                  {new Date(selectedBalance.lastUpdate).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            {/if}
          </div>
          
          <div class="flex justify-end space-x-3 pt-2">
            <button
              class="px-4 py-2 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
            >
              Eliminar
            </button>
            <button
              class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
            >
              Editar
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
