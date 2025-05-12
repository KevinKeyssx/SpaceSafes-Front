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
  export let accounts: Account[] = [];
  export let selectedAccountId: number | null = null;
  export let onSelectAccount: (accountId: number) => void = () => {};

  // Métodos
  function handleAccountClick(accountId: number) {
    selectedAccountId = accountId;
    onSelectAccount(accountId);
  }
</script>

<div class="bg-primary-50/30 dark:bg-primary-800/30 backdrop-blur-xl rounded-xl shadow-lg animate-fade-in border border-primary-200/50 dark:border-primary-700/50">
  <div class="p-8">
    <h2 class="text-2xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
      Cuentas
    </h2>
    <div class="space-y-4">
      {#each accounts as account (account.id)}
        <div
          role="button"
          tabindex="0"
          on:click={() => handleAccountClick(account.id)}
          on:keydown={(e) => e.key === 'Enter' && handleAccountClick(account.id)}
          class="flex items-center p-5 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-102 group animate-slide-up backdrop-blur-lg {
            selectedAccountId === account.id
              ? 'bg-primary-100/40 dark:bg-primary-700/40 ring-2 ring-primary-400/50'
              : 'hover:bg-primary-50/40 dark:hover:bg-primary-700/40 hover:shadow-lg'
          }"
        >
          <img
            src={account.avatar}
            alt={account.fullName}
            class="w-12 h-12 rounded-full ring-2 ring-primary-200 dark:ring-primary-700 transition-transform duration-300 group-hover:scale-110"
          />
          <div class="ml-4 flex-1 transition-transform duration-300 group-hover:translate-x-2">
            <h3 class="text-base font-semibold text-primary-900 dark:text-primary-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
              {account.fullName}
            </h3>
            <p class="text-sm text-primary-600 dark:text-primary-300 group-hover:text-primary-500 dark:group-hover:text-primary-300">
              {account.email}
            </p>
          </div>
          <div class="ml-4">
            <span
              class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 group-hover:scale-105 backdrop-blur-md {
                account.status === 'active'
                  ? 'bg-emerald-100/70 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50'
                  : 'bg-primary-100/70 dark:bg-primary-900/30 text-primary-800 dark:text-primary-400 border border-primary-200/50 dark:border-primary-700/50'
              }"
            >
              {account.status}
            </span>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
