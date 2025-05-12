<script lang="ts">
  import AccountList from './AccountList.svelte';
  import AccountDetail from './AccountDetail.svelte';

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

  // Estado
  let selectedAccountId: number | null = null;

  // Manejadores de eventos
  function handleSelectAccount(accountId: number) {
    selectedAccountId = accountId;
  }
</script>

<div class="flex space-x-6">
  <div class="flex-1">
    <AccountList 
      {accounts} 
      {selectedAccountId} 
      onSelectAccount={handleSelectAccount} 
    />
  </div>

  <div class="w-80">
    <AccountDetail {selectedAccountId} />
  </div>
</div>
