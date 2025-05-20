
<script lang="ts">
    import { slide } from 'svelte/transition';

    import toast from 'svelte-french-toast';

    import { errorToast, successToast } from '@/config/toast/toast.config';

    import Input            from "@/components/ui/Inputs/Input.svelte";
    import Switch           from "@/components/ui/Inputs/Switch.svelte";
    import OutlineButton    from '@/components/ui/Buttons/OutlineButton.svelte';
    import type { Account, AccountNavly } from "@/models/account/account.model";
    import ShowIcon from '@/icons/ShowIcon.svelte';
    import { loadSpaceSafes } from '@/services/fetch/getSpaceSafes';
    import { addLink }                      from '@/stores/linksStore';
    import { addAccount, updateAccount }    from '@/stores/accountsStore';
    import SaveButton from '../ui/Buttons/SaveButton.svelte';
    import Popover from '../ui/bits/Popover.svelte';
    import PasswordControls from '../password/PasswordControls.svelte';
    import KeyIcon from '@/icons/KeyIcon.svelte';


    export let account: Account = {} as Account;
    export let open : boolean;


    let accountEdit = { ...account };
    let showPassword = false;
    let isLoadingSave = false


    if ( !accountEdit.id || accountEdit.navly?.length === 0 ) {
        accountEdit.navly = [{url: ''}];
    }


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
            toast.error( 'Debes completar los campos requeridos (*)', errorToast() );
            return;
        }

        isLoadingSave = true;

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

        if ( !savedAccount ) {
            isLoadingSave = false;
            toast.error( 'Debes completar los campos requeridos (*)', errorToast() );
            return;
        }

        addAccount( savedAccount.account );
        addLink( savedAccount.navly );
        open = false;
        isLoadingSave = false;
        toast.success( 'Cuenta registrada correctamente.', successToast() );
    }


    async function updatedAccount() {
        console.log('🚀 ~ file: AccountForm.svelte:12 ~ accountEdit:', accountEdit)

        isLoadingSave = true;

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

        if ( !savedAccount ) {
            isLoadingSave = false;
            toast.error( 'Error al actualizar la cuenta', errorToast() );
            return;
        };

        updateAccount( savedAccount );
        open = false;

        console.log('🚀 ~ file: AccountForm.svelte:41 ~ newAccount:', savedAccount)
        isLoadingSave = false;
        toast.success( 'Cuenta actualizada correctamente.', successToast() );
    }


    async function saveAccount(): Promise<void> {
        if ( !accountEdit.id ) {
            createAccount();
            return;
        }

        updatedAccount();
    }

    let openPassword = false
</script>

<form
    class="px-5 py-0 space-y-3" on:submit|preventDefault={saveAccount}
    transition:slide={{ duration: 300 }}
>
    <Input
        label="Nombre de la cuenta"
        id="name"
        type="text" 
        placeholder="Ingrese el nombre de la cuenta"
        bind:value={accountEdit.name}
    />

    <Input
        label="Nombre (*)"
        id="account-name"
        type="text" 
        required
        placeholder="Ingrese el nombre de la cuenta"
        bind:value={accountEdit.username}
    />

    <div class="grid grid-cols-[1fr,0.1fr,0.1fr] items-end gap-2"> 
        <Input
            label="Contraseña (*)"
            id="account-password"
            type={showPassword ? "text" : "password"} 
            required
            placeholder="Ingrese la contraseña"
            bind:value={accountEdit.password}
        />

        <Popover bind:open={openPassword}>
            {#snippet trigger()}
                <OutlineButton
                    onClick={() => showPassword = true}
                >
                    <KeyIcon />
                </OutlineButton>
            {/snippet}

            {#snippet content()}
                <PasswordControls
                    bind:password={accountEdit.password}
                    usePassword={() => openPassword = false}
                />
            {/snippet}
        </Popover>

        <OutlineButton
            onClick={() => showPassword = !showPassword}
        >
            <ShowIcon />
        </OutlineButton>
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
        placeholder="Ingrese el enlace"
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
    <SaveButton
        disabled={isLoadingSave}
        isEdit={accountEdit.id ? true : false}
    />
</form>
