<script lang="ts">
  // Definición de tipos
  interface Account {
    id: number;
    username: string;
    email: string;
    fullName: string;
    role: string;
    lastLogin: string;
    status: string;
    avatar: string;
  }
  
  // Props
  export let selectedAccountId: number | null = null;
  
  // Estado
  $: selectedAccount = selectedAccountId ? accounts.find(a => a.id === selectedAccountId) : null;

  // Datos de cuentas
  const accounts: Account[] = [
    {
      id: 1,
      username: "john_doe",
      email: "john@example.com",
      fullName: "John Doe",
      role: "Administrator",
      lastLogin: "2024-01-15T10:30:00",
      status: "active",
      avatar: "https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff"
    },
    {
      id: 2,
      username: "jane_smith",
      email: "jane@example.com",
      fullName: "Jane Smith",
      role: "Editor",
      lastLogin: "2024-01-14T15:45:00",
      status: "active",
      avatar: "https://ui-avatars.com/api/?name=Jane+Smith&background=2F855A&color=fff"
    },
    {
      id: 3,
      username: "mike_wilson",
      email: "mike@example.com",
      fullName: "Mike Wilson",
      role: "User",
      lastLogin: "2024-01-13T09:20:00",
      status: "inactive",
      avatar: "https://ui-avatars.com/api/?name=Mike+Wilson&background=9F580A&color=fff"
    },
    {
      id: 4,
      username: "sarah_johnson",
      email: "sarah@example.com",
      fullName: "Sarah Johnson",
      role: "Editor",
      lastLogin: "2024-01-12T16:15:00",
      status: "active",
      avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=1E429F&color=fff"
    },
    {
      id: 5,
      username: "alex_brown",
      email: "alex@example.com",
      fullName: "Alex Brown",
      role: "User",
      lastLogin: "2024-01-11T11:50:00",
      status: "active",
      avatar: "https://ui-avatars.com/api/?name=Alex+Brown&background=7E1F86&color=fff"
    },
    {
      id: 6,
      username: "alex_brown",
      email: "alex@example.com",
      fullName: "Alex Brown",
      role: "User",
      lastLogin: "2024-01-11T11:50:00",
      status: "active",
      avatar: "https://ui-avatars.com/api/?name=Alex+Brown&background=7E1F86&color=fff"
    },
    {
      id: 7,
      username: "alex_brown",
      email: "alex@example.com",
      fullName: "Alex Brown",
      role: "User",
      lastLogin: "2024-01-11T11:50:00",
      status: "active",
      avatar: "https://ui-avatars.com/api/?name=Alex+Brown&background=7E1F86&color=fff"
    },
    {
      id: 8,
      username: "alex_brown",
      email: "alex@example.com",
      fullName: "Alex Brown",
      role: "User",
      lastLogin: "2024-01-11T11:50:00",
      status: "active",
      avatar: "https://ui-avatars.com/api/?name=Alex+Brown&background=7E1F86&color=fff"
    },
    {
      id: 9,
      username: "alex_brown",
      email: "alex@example.com",
      fullName: "Alex Brown",
      role: "User",
      lastLogin: "2024-01-11T11:50:00",
      status: "active",
      avatar: "https://ui-avatars.com/api/?name=Alex+Brown&background=7E1F86&color=fff"
    },
    {
      id: 10,
      username: "alex_brown",
      email: "alex@example.com",
      fullName: "Alex Brown",
      role: "User",
      lastLogin: "2024-01-11T11:50:00",
      status: "active",
      avatar: "https://ui-avatars.com/api/?name=Alex+Brown&background=7E1F86&color=fff"
    }
  ];

  // No necesitamos funciones de manejo de eventos ni ciclo de vida
  // ya que usamos props reactivos con $: selectedAccount
</script>

{#if !selectedAccount}
  <div class="bg-primary-50/30 dark:bg-primary-800/30 backdrop-blur-xl rounded-lg shadow-lg border border-primary-200/50 dark:border-primary-700/50 p-6">
    <p class="text-primary-600 dark:text-primary-300 text-center">
      Selecciona una cuenta para ver sus detalles
    </p>
  </div>
{:else}
  <div class="bg-primary-50/30 dark:bg-primary-800/30 backdrop-blur-xl rounded-lg shadow-lg border border-primary-200/50 dark:border-primary-700/50">
    <div class="p-6">
      <div class="flex flex-col items-center">
        <img
          src={selectedAccount.avatar}
          alt={selectedAccount.fullName}
          class="w-20 h-20 rounded-full ring-4 ring-primary-200/50 dark:ring-primary-700/50"
        />
        <h2 class="mt-4 text-xl font-semibold text-primary-900 dark:text-primary-100">
          {selectedAccount.fullName}
        </h2>
        <p class="text-sm text-primary-600 dark:text-primary-300">
          {selectedAccount.role}
        </p>
      </div>

      <div class="mt-6 space-y-4">
        <div>
          <p class="text-sm font-medium text-primary-600 dark:text-primary-300">
            Username
          </p>
          <p class="mt-1 text-sm text-primary-900 dark:text-primary-100">
            {selectedAccount.username}
          </p>
        </div>

        <div>
          <p class="text-sm font-medium text-primary-600 dark:text-primary-300">
            Email
          </p>
          <p class="mt-1 text-sm text-primary-900 dark:text-primary-100">
            {selectedAccount.email}
          </p>
        </div>

        <div>
          <p class="text-sm font-medium text-primary-600 dark:text-primary-300">
            Estado
          </p>
          <p class="mt-1">
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium backdrop-blur-md {
                selectedAccount.status === 'active'
                  ? 'bg-emerald-100/70 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50'
                  : 'bg-primary-100/70 dark:bg-primary-900/30 text-primary-800 dark:text-primary-400 border border-primary-200/50 dark:border-primary-700/50'
              }"
            >
              {selectedAccount.status}
            </span>
          </p>
        </div>

        <div>
          <p class="text-sm font-medium text-primary-600 dark:text-primary-300">
            Último acceso
          </p>
          <p class="mt-1 text-sm text-primary-900 dark:text-primary-100">
            {new Date(selectedAccount.lastLogin).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  </div>
{/if}
