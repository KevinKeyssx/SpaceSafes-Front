<script lang="ts">
  // Definición de tipos
  type BalanceCategory = 'bank' | 'cash' | 'card' | 'freelance' | 'investment' | 'savings';

  interface FormData {
    name: string;
    category: BalanceCategory;
    amount: number | string;
    iban?: string;
    entity?: string;
    brand?: string;
    last4?: string;
    description?: string;
  }

  interface Balance extends FormData {
    id: number;
    lastUpdate: string;
  }

  // Props
  export let onAdd: (balance: Balance) => void;
  export let onCancel: () => void;

  // Estado local
  let formData: FormData = {
    name: '',
    category: 'bank',
    amount: '',
    iban: '',
    entity: '',
    brand: '',
    last4: '',
    description: ''
  };

  // Manejadores de eventos
  function handleChange(e: Event) {
    const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const name = target.name;
    const value = target.value;

    if (name === 'amount') {
      formData = {
        ...formData,
        [name]: value === '' ? '' : parseFloat(value)
      };
    } else {
      formData = {
        ...formData,
        [name]: value
      };
    }
  }

  function handleSubmit(e: Event) {
    e.preventDefault();
    
    // Validar campos obligatorios
    if (!formData.name || !formData.category || formData.amount === '') {
      alert('Por favor, completa los campos obligatorios: Nombre, Categoría y Monto');
      return;
    }
    
    // Validar campos específicos según la categoría
    if (formData.category === 'bank' && !formData.iban) {
      alert('Para cuentas bancarias, el IBAN es obligatorio');
      return;
    }
    
    if (formData.category === 'card' && (!formData.brand || !formData.last4)) {
      alert('Para tarjetas, la marca y los últimos 4 dígitos son obligatorios');
      return;
    }
    
    // Crear nuevo balance con fecha de actualización
    const newBalance: Balance = {
      ...formData,
      id: Date.now(),
      lastUpdate: new Date().toISOString(),
      amount: typeof formData.amount === 'string' ? parseFloat(formData.amount) : formData.amount
    };
    
    onAdd(newBalance);
    
    // Resetear formulario
    formData = {
      name: '',
      category: 'bank',
      amount: '',
      iban: '',
      entity: '',
      brand: '',
      last4: '',
      description: ''
    };
  }
</script>

<div class="bg-primary-50/30 dark:bg-primary-800/30 backdrop-blur-xl rounded-xl shadow-lg border border-primary-200/50 dark:border-primary-700/50 p-6">
  <h2 class="text-xl font-bold text-primary-900 dark:text-primary-100 mb-4">Añadir nuevo balance</h2>
  
  <form on:submit={handleSubmit} class="space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <p class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">
          Nombre *
        </p>
        <input
          type="text"
          name="name"
          bind:value={formData.name}
          on:input={handleChange}
          class="w-full px-4 py-2 bg-primary-50/50 dark:bg-primary-800/50 border border-primary-200/50 dark:border-primary-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 text-primary-900 dark:text-primary-100"
          placeholder="Ej: Mi cuenta principal"
          required
        />
      </div>
      
      <div>
        <p class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">
          Categoría *
        </p>
        <select
          name="category"
          bind:value={formData.category}
          on:change={handleChange}
          class="w-full px-4 py-2 bg-primary-50/50 dark:bg-primary-800/50 border border-primary-200/50 dark:border-primary-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 text-primary-900 dark:text-primary-100"
          required
        >
          <option value="bank">Cuenta Bancaria</option>
          <option value="cash">Efectivo</option>
          <option value="card">Tarjeta</option>
          <option value="freelance">Trabajo Freelance</option>
          <option value="investment">Inversión</option>
          <option value="savings">Ahorros</option>
        </select>
      </div>
      
      <div>
        <p class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">
          Monto disponible *
        </p>
        <input
          type="number"
          name="amount"
          bind:value={formData.amount}
          on:input={handleChange}
          class="w-full px-4 py-2 bg-primary-50/50 dark:bg-primary-800/50 border border-primary-200/50 dark:border-primary-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 text-primary-900 dark:text-primary-100"
          placeholder="0.00"
          step="0.01"
          min="0"
          required
        />
      </div>
      
      <!-- Campos específicos para cuenta bancaria -->
      {#if formData.category === 'bank'}
        <div>
          <p class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">
            IBAN *
          </p>
          <input
            type="text"
            name="iban"
            bind:value={formData.iban}
            on:input={handleChange}
            class="w-full px-4 py-2 bg-primary-50/50 dark:bg-primary-800/50 border border-primary-200/50 dark:border-primary-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 text-primary-900 dark:text-primary-100 font-mono"
            placeholder="ES91 2100 0418 4502 0005 1332"
            required
          />
        </div>
        
        <div>
          <p class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">
            Entidad bancaria
          </p>
          <input
            type="text"
            name="entity"
            bind:value={formData.entity}
            on:input={handleChange}
            class="w-full px-4 py-2 bg-primary-50/50 dark:bg-primary-800/50 border border-primary-200/50 dark:border-primary-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 text-primary-900 dark:text-primary-100"
            placeholder="Ej: BBVA"
          />
        </div>
      {/if}
      
      <!-- Campos específicos para tarjeta -->
      {#if formData.category === 'card'}
        <div>
          <p class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">
            Marca de tarjeta *
          </p>
          <select
            name="brand"
            bind:value={formData.brand}
            on:change={handleChange}
            class="w-full px-4 py-2 bg-primary-50/50 dark:bg-primary-800/50 border border-primary-200/50 dark:border-primary-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 text-primary-900 dark:text-primary-100"
            required
          >
            <option value="">Seleccionar marca</option>
            <option value="Visa">Visa</option>
            <option value="Mastercard">Mastercard</option>
            <option value="American Express">American Express</option>
            <option value="Discover">Discover</option>
          </select>
        </div>
        
        <div>
          <p class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">
            Últimos 4 dígitos *
          </p>
          <input
            type="text"
            name="last4"
            bind:value={formData.last4}
            on:input={handleChange}
            class="w-full px-4 py-2 bg-primary-50/50 dark:bg-primary-800/50 border border-primary-200/50 dark:border-primary-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 text-primary-900 dark:text-primary-100 font-mono"
            placeholder="1234"
            maxlength="4"
            pattern="[0-9]{4}"
            required
          />
        </div>
      {/if}
    </div>
    
    <div>
      <p class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">
        Descripción
      </p>
      <textarea
        name="description"
        bind:value={formData.description}
        on:input={handleChange}
        class="w-full px-4 py-2 bg-primary-50/50 dark:bg-primary-800/50 border border-primary-200/50 dark:border-primary-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 text-primary-900 dark:text-primary-100"
        placeholder="Añade detalles adicionales..."
        rows="3"
      ></textarea>
    </div>
    
    <div class="flex justify-end space-x-3 pt-2">
      <button
        type="button"
        on:click={onCancel}
        class="px-4 py-2 border border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-800/50 transition-colors"
        on:keydown={(e) => e.key === 'Enter' && onCancel()}
      >
        Cancelar
      </button>
      <button
        type="submit"
        class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
      >
        Guardar
      </button>
    </div>
  </form>
</div>
