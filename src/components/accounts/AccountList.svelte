<script lang="ts">
    import type { Account } from "@/models/account/account.model";
    import AccountCard      from "./AccountCard.svelte";
    import AccountDetail    from "./AccountDetail.svelte";


    export let accounts: Account[] = [];
    export let selectedAccount: Account | null = null;


    const handleAccountClick = ( account: Account ) => selectedAccount = account;
</script>

<div class="flex">
    <div class="w-[calc(100%-320px)]">
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {#each accounts as account (account.id)}
                <AccountCard 
                    {account} 
                    {handleAccountClick} 
                    selectedAccountId={selectedAccount?.id ?? null}
                />
            {/each}
        </div>
    </div>

    <div class="w-6"></div>

    <div class="w-[300px] flex-shrink-0">
        <AccountDetail {selectedAccount} />
    </div>
</div>
