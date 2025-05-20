<script lang="ts">
    import { slide } from 'svelte/transition';

    import toast from 'svelte-french-toast';

    import { errorToast, successToast } from '@/config/toast/toast.config';

    import Input        from "@/components/ui/Inputs/Input.svelte";
    import Switch       from "@/components/ui/Inputs/Switch.svelte";
    import Combobox     from '@/components/ui/Inputs/Combobox.svelte';

    import { TypeCard }     from '@/models/balance/enum/type-card.enum';
    import type { Balance } from '@/models/balance/balance.model';
    import { TypeBalance }  from '@/models/balance/enum/type-balance.enum';

    import { loadSpaceSafes } from '@/services/fetch/getSpaceSafes';

    import { addBalance, updateBalance } from '@/stores/balanceStore';
    import SaveButton from '../ui/Buttons/SaveButton.svelte';


    export let balance: Balance = {} as Balance;
    export let open : boolean;


    let isLoadingSave = false;
    let balanceEdit = { 
        ...balance,
        balance: balance.balance || 0,
    };


    $: showCardFields = balanceEdit.type === TypeBalance.CREDIT || balanceEdit.type === TypeBalance.DEBIT;
    $: showBankFields = balanceEdit.type === TypeBalance.BANK_ACCOUNT || balanceEdit.type === TypeBalance.SAVINGS || showCardFields;


    async function createBalance(): Promise<void> {
        const cleanedBalance = cleanBalanceData(balanceEdit.type);
        console.log('🚀 ~ file: BalanceForm.svelte:45 ~ cleanedBalance:', cleanedBalance)

        const savedBalance = await loadSpaceSafes<Balance>({
            url: `/api/space-safes/balances`,
            method: 'POST',
            data: cleanedBalance
        });

        console.log('🚀 ~ file: BalanceForm.svelte:48 ~ savedBalance:', savedBalance)

        if ( !savedBalance ) {
            isLoadingSave = false;
            toast.error( 'Ocurrió un error al guardar el balance', errorToast() );
            return;
        }

        addBalance( savedBalance );
        open = false;
        isLoadingSave = false;
        toast.success( 'Balance guardado correctamente', successToast() );
    }

    async function updatedBalance() {
        console.log('🚀 ~ file: BalanceForm.svelte ~ updatedBalance ~ balanceEdit:', balanceEdit)
        const cleanedBalance = cleanBalanceData(balanceEdit.type);
        
        const savedBalance = await loadSpaceSafes<Balance>({
            url: `/api/space-safes/balances/${balanceEdit.id}`,
            method: 'PATCH',
            data: cleanedBalance
        });

        if ( !savedBalance ) {
            isLoadingSave = false;
            toast.error( 'Ocurrió un error al guardar el balance', errorToast() );
            return;
        }

        updateBalance( savedBalance );
        open = false;
        isLoadingSave = false;
        toast.success( 'Balance actualizado correctamente', successToast() );
    }


    $: basicBalance = {
        name        : balanceEdit.name,
        type        : balanceEdit.type,
        balance     : balanceEdit.balance,
        isFavorite  : balanceEdit.isFavorite,
    }


    $: cardBalance = {
        ...basicBalance,
        typeCard            : balanceEdit.typeCard,
        cardNumber          : balanceEdit.cardNumber,
        expirationDate      : balanceEdit.expirationDate,
        verificationNumber  : String(balanceEdit.verificationNumber),
        bankName            : balanceEdit.bankName,
        ...( balanceEdit.type === TypeBalance.DEBIT ? { accountNumber: balanceEdit.accountNumber } : {} )
    }


    $: bankBalance = {
        ...basicBalance,
        bankName        : balanceEdit.bankName,
        accountNumber   : balanceEdit.accountNumber,
    }


    const cleanBalanceData = ( typeBalance: TypeBalance ): object => ({
        [TypeBalance.CASH]          : basicBalance,
        [TypeBalance.FREELANCE]     : basicBalance,
        [TypeBalance.INVESTMENT]    : basicBalance,
        [TypeBalance.OTHER]         : basicBalance,
        [TypeBalance.CREDIT]        : cardBalance,
        [TypeBalance.DEBIT]         : cardBalance,
        [TypeBalance.BANK_ACCOUNT]  : bankBalance,
        [TypeBalance.SAVINGS]       : bankBalance,
    }[ typeBalance ] || basicBalance );


    async function saveBalance(): Promise<void> {
        console.log('🚀 ~ file: BalanceForm.svelte:109 ~ saveBalance: CLIC')
        isLoadingSave = true;

        if ( !balanceEdit.id ) {
            await createBalance();
            return;
        }

        await updatedBalance();
    }
</script>

<form
    class="p-5" on:submit|preventDefault={saveBalance}
    transition:slide={{ duration: 300 }}
>
    <div class="space-y-4">
        <Input
            label="Nombre"
            id="name"
            type="text" 
            placeholder="Nombre del balance"
            bind:value={balanceEdit.name}
            required
        />

        <Combobox
            id="type"
            name="type"
            label="Tipo de Balance"
            placeholder="Seleccionar tipo"
            bind:value={balanceEdit.type}
            options={[
                { value: TypeBalance.CASH,          label: "Efectivo" },
                { value: TypeBalance.CREDIT,        label: "Tarjeta de Crédito" },
                { value: TypeBalance.DEBIT,         label: "Tarjeta de Débito" },
                { value: TypeBalance.BANK_ACCOUNT,  label: "Cuenta Bancaria" },
                { value: TypeBalance.SAVINGS,       label: "Cuenta de Ahorros" },
                { value: TypeBalance.FREELANCE,     label: "Ingresos Freelance" },
                { value: TypeBalance.INVESTMENT,    label: "Inversión" },
                { value: TypeBalance.OTHER,         label: "Otro" },
            ]}
        />

        <Input
            label="amount"
            id="amount"
            type="number"
            min={0}
            max={999999999}
            placeholder="Ingrese el monto"
            bind:value={balanceEdit.balance}
            required
        />

        {#if showCardFields}
            <div
                transition:slide={{ duration: 300 }}
                class="space-y-4"
            >
                <Combobox
                    id="type-card"
                    name="type-card"
                    label="Tipo de Tarjeta"
                    placeholder="Seleccionar tipo"
                    bind:value={balanceEdit.typeCard}
                    options={[
                        { value: TypeCard.VISA,             label: "Visa" },
                        { value: TypeCard.VISA_ELECTRON,    label: "Visa Electron" },
                        { value: TypeCard.MASTERCARD,       label: "Mastercard" },
                        { value: TypeCard.AMERICAN_EXPRESS, label: "American Express" },
                        { value: TypeCard.DISCOVER,         label: "Discover" },
                        { value: TypeCard.JCB,              label: "JCB" },
                        { value: TypeCard.DINERS_CLUB,      label: "Diners Club" },
                        { value: TypeCard.UNIONPAY,         label: "Unionpay" },
                        { value: TypeCard.MAESTRO,          label: "Maestro" },
                        { value: TypeCard.ELO,              label: "Elo" },
                        { value: TypeCard.HIPERCARD,        label: "Hipercard" },
                        { value: TypeCard.AURA,             label: "Aura" },
                    ]}
                />

                <Input
                    label="Número de Tarjeta"
                    id="card-number"
                    type="text" 
                    placeholder="Número de Tarjeta"
                    bind:value={balanceEdit.cardNumber!}
                    required
                />

                <div class="flex gap-2">
                    <Input
                        label="Fecha de Expiración"
                        id="expiration-date"
                        type="text" 
                        placeholder="Fecha de Expiración"
                        bind:value={balanceEdit.expirationDate!}
                        required
                    />

                    <Input
                        label="Número de Verificación"
                        id="verification-number"
                        type="number"
                        min={100}
                        max={9999}
                        placeholder="Ingrese el número de verificación"
                        bind:value={balanceEdit.verificationNumber!}
                        required
                    />
                </div>
            </div>
        {/if}

        {#if showBankFields}
            <div transition:slide={{ duration: 300 }}>
                <Input
                    label="Nombre del Banco"
                    id="bank-name"
                    type="text" 
                    placeholder="Nombre del Banco"
                    bind:value={balanceEdit.bankName!}
                    required
                />
            </div>
        {/if}

        {#if balanceEdit.type === TypeBalance.DEBIT || balanceEdit.type === TypeBalance.BANK_ACCOUNT || balanceEdit.type === TypeBalance.SAVINGS}
            <div transition:slide={{ duration: 300 }}>
                <Input
                    label="Número de Cuenta"
                    id="account-number"
                    type="text" 
                    placeholder="Número de Cuenta"
                    bind:value={balanceEdit.accountNumber!}
                    required
                />
            </div>
        {/if}

        <Switch
            label="Marcar como favorito"
            id="isFavorite"
            bind:checked={balanceEdit.isFavorite}
        />
    </div>

    <SaveButton
        disabled={isLoadingSave}
        isEdit={balanceEdit.id ? true : false}
    />
</form>
