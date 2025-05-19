<script lang="ts">
    import Dialog                   from '@/components/ui/bits/Dialog.svelte';
    import { formatCurrency }       from '@/utils/currencyUtils';
    import type { PaymentDetail }   from '@/models/payment-detail/payment-detail.model';
    import { loadSpaceSafes }       from '@/services/fetch/getSpaceSafes';
    import { updateBalance }        from '@/stores/balanceStore';
    import { removePaymentDetail }  from '@/stores/paymentDetail.Store';


    export let paymentDetail: PaymentDetail;


    let openDelete = false;


    async function confirmDelete(): Promise<void> {
        const deletedPaymentDetail = await loadSpaceSafes<PaymentDetail>({
            url: `/api/space-safes/payment-details/${paymentDetail.id}`,
            method: 'DELETE'
        });

        console.log('🚀 ~ file: AccountForm.svelte:53 ~ savedAccount:', deletedPaymentDetail)

        if ( !deletedPaymentDetail ) {
            return;
        }

        const amount = paymentDetail.balance.balance + paymentDetail.amount;
        const updatedBalancePayement = {
            ...paymentDetail.balance,
            balance: amount
        };


        updateBalance( updatedBalancePayement );
        removePaymentDetail( paymentDetail.id );
        openDelete = false;
    }
</script>

<card
    class="p-3 rounded-md shadow-sm border transition-all cursor-pointer bg-white dark:bg-primary-700 border-primary-200 dark:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-600"
>
    <div class="flex items-start space-x-3">
        <div class="flex-1">
            <p id="payment-desc-{paymentDetail.id}" class="font-medium text-primary-800 dark:text-primary-100">
                {paymentDetail.paymentService.description || 'Sin descripción descripcin'}
            </p>

            <p class="text-sm text-primary-600 dark:text-primary-300">
                {formatCurrency(paymentDetail.amount || 0)}
            </p>

            <p class="text-xs text-green-600 dark:text-green-400">Pagado</p>
        </div>

        <Dialog
            openButtonClass=" bg-rose-300 hover:bg-rose-400 shadow-lg p-1 rounded-lg transition-colors duration-300"
            bind:open={openDelete}
        >
            {#snippet iconButton()}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="24" stroke-dashoffset="24" d="M12 20h5c0.5 0 1 -0.5 1 -1v-14M12 20h-5c-0.5 0 -1 -0.5 -1 -1v-14"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="24;0"/></path><path stroke-dasharray="20" stroke-dashoffset="20" d="M4 5h16"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.2s" values="20;0"/></path><path stroke-dasharray="8" stroke-dashoffset="8" d="M10 4h4M10 9v7M14 9v7"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="8;0"/></path></g></svg>
            {/snippet}

            {#snippet title()}
                Eliminar Pago
            {/snippet}

            <div class="space-y-2 w-full">
                <p class="text-primary-200 grid text-center">¿Estás seguro de eliminar el pago?
                    <span class="text-primary-500">
                        Esta acción no se puede deshacer, tu balance también será afectado.
                    </span>
                </p>

                <button 
                    type="button" 
                    on:click={confirmDelete}
                    class="mx-auto gap-2 flex justify-center px-4 py-1 w-48 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="24" stroke-dashoffset="24" d="M12 20h5c0.5 0 1 -0.5 1 -1v-14M12 20h-5c-0.5 0 -1 -0.5 -1 -1v-14"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="24;0"/></path><path stroke-dasharray="20" stroke-dashoffset="20" d="M4 5h16"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.2s" values="20;0"/></path><path stroke-dasharray="8" stroke-dashoffset="8" d="M10 4h4M10 9v7M14 9v7"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="8;0"/></path></g></svg>
                    Eliminar Pago
                </button>
            </div>
        </Dialog>
    </div>
</card>
