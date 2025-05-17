
<script lang="ts">
    import { slide } from 'svelte/transition';

    import type { Account, AccountNavly } from "@/models/account/account.model";
    import Input            from "@/components/ui/Inputs/Input.svelte";
    import Switch           from "@/components/ui/Inputs/Switch.svelte";
    import { addAccount, updateAccount } from '@/stores/accountsStore';
    import { loadSpaceSafes } from '@/services/fetch/getSpaceSafes';
    import { addLink } from '@/stores/linksStore';


    export let account: Account = {} as Account;
    export let open : boolean;

    let accountEdit = { ...account };

    if ( !accountEdit.id || accountEdit.navly?.length === 0 ) {
        accountEdit.navly = [{url: ''}];
    }

    let showPassword = false;


    function isValidUrl(url: string): boolean {
        try {
            new URL(url);
            return true;
        } catch (error) {
            return false;
        }
    }

    async function createAccount(): Promise<void> {
        console.log('🚀 ~ file: AccountForm.svelte:12 ~ accountEdit:', accountEdit)

        if ( !accountEdit.username || !accountEdit.password ) {
            return;
        }

        const { navly, ...dataWithoutNavly } = accountEdit;
        const newAccount: Record<string, any> = { ...dataWithoutNavly };

        if (navly && navly.length > 0 && navly[0].url && isValidUrl(navly[0].url)) {
            newAccount.url = navly[0].url;
        }

        console.log('🚀 ~ file: AccountForm.svelte:51 ~ newAccount:', newAccount)


        const savedAccount = await loadSpaceSafes<AccountNavly>({
            url: `/api/space-safes/accounts`,
            method: 'POST',
            data: newAccount
        });

        if ( !savedAccount ) return;

        addAccount( savedAccount.account );
        addLink( savedAccount.navly );
        open = false;

        console.log('🚀 ~ file: AccountForm.svelte:53 ~ savedAccount:', savedAccount)
    }


    async function updatedAccount() {
        console.log('🚀 ~ file: AccountForm.svelte:12 ~ accountEdit:', accountEdit)


        const  {
            createdAt,
            updatedAt,
            id,
            navly,
            ...rest
        } = accountEdit;

        const savedAccount = await loadSpaceSafes<Account>({
            url: `/api/space-safes/accounts/${accountEdit.id}`,
            method: 'PATCH',
            data: rest
        });
        console.log('🚀 ~ file: AccountForm.svelte:80 ~ savedAccount:', savedAccount)

        if ( !savedAccount ) return;

        updateAccount( savedAccount );
        open = false;

        console.log('🚀 ~ file: AccountForm.svelte:41 ~ newAccount:', savedAccount)
    }


    async function saveAccount(): Promise<void> {
        if ( !accountEdit.id ) {
            createAccount();
            return;
        }

        updatedAccount();
    }
</script>

<form
    class="p-5 space-y-1" on:submit|preventDefault={saveAccount}
    transition:slide={{ duration: 300 }}
>
    <Input
        label="Nombre de la cuenta"
        id="name"
        type="text" 
        bind:value={accountEdit.name}
    />

    <Input
        label="Nombre"
        id="account-name"
        type="text" 
        bind:value={accountEdit.username}
    />

    <div class="flex items-center gap-2"> 
        <Input
            label="Contraseña"
            id="account-password"
            type={showPassword ? "text" : "password"} 
            bind:value={accountEdit.password}
        />

        <button
            on:click={() => showPassword = !showPassword}
            type="button"
            aria-label="Mostrar contraseña"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="0" fill="currentColor"><animate fill="freeze" attributeName="r" dur="0.2s" values="0;3"/></circle><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12c1.38 -0.77 4.42 -1.3 8 -1.3c3.58 0 6.62 0.53 8 1.3c-1.38 0.77 -4.42 1.3 -8 1.3c-3.58 0 -6.62 -0.53 -8 -1.3Z"><animate fill="freeze" attributeName="d" dur="0.5s" values="M4 12c1.38 -0.77 4.42 -1.3 8 -1.3c3.58 0 6.62 0.53 8 1.3c-1.38 0.77 -4.42 1.3 -8 1.3c-3.58 0 -6.62 -0.53 -8 -1.3Z;M2 12c1.72 -3.83 5.53 -6.5 10 -6.5c4.47 0 8.28 2.67 10 6.5c-1.72 3.83 -5.53 6.5 -10 6.5c-4.47 0 -8.28 -2.67 -10 -6.5Z"/></path></svg>
        </button>
    </div>

    <Switch
        label="Marcar como favorito"
        id="account-favorite"
        bind:checked={accountEdit.isFavorite}
    />

    <span class="text-sm font-medium text-primary-700 dark:text-primary-200 mb-1">Enlaces</span>

    <Input
    id="account-navly"
    type="text"
    bind:value={accountEdit.navly[0].url}
/>

    <!-- <div bind:this={navlyContainer} class="flex flex-col gap-2 max-h-60 overflow-auto p-1">
        {#each accountEdit.navly as navly}
            <div
                class=" flex gap-2 w-full"
                transition:slide={{ duration: 300 }}
            >
                <Input
                    id="account-navly"
                    type="text"
                    bind:value={navly.url}
                />

                <button
                    type="button"
                    on:click={() => removeNavlyUrl(accountEdit.navly.indexOf(navly))}
                    class="w-10 h-10 flex items-center justify-center py-2 ring-2 ring-primary-500 hover:bg-primary-700 text-white rounded-lg transition-colors"
                    aria-label="Agregar enlace"
                >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-dasharray="16" stroke-dashoffset="16" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="16;0"/></path></svg>
                </button>
            </div>
        {/each}
    </div> -->
<!-- 
    <button
        type="button"
        on:click={addNavlyUrl}
        class="w-full mt-1 mx-auto rounded-lg text-center justify-center items-center px-4 py-1 ring-2 ring-primary-500 hover:bg-primary-700 text-white transition-colors flex"
        aria-label="Agregar enlace"
    >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-dasharray="16" stroke-dashoffset="16" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M5 12h14"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="16;0"/></path><path d="M12 5v14"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.4s" values="16;0"/></path></g></svg>
    </button> -->

    <button
        type="submit"
        class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors"
    >
        Guardar
    </button>
</form>
