<script lang="ts">
    import { slide } from 'svelte/transition';
    import { loadSpaceSafes } from '@/services/fetch/getSpaceSafes'; // Assuming path from previous correct state
    import { deletePaymentService } from '@/stores/paymentServiceStore'; // Assuming path
    import type { Link } from '@/models/links/link.model'; // For API response typing
    import type { PaymentService } from '@/models/payment-services/payment-service.model'; 
    import Dialog from '@/components/ui/bits/Dialog.svelte'; 

    export let paymentService: PaymentService;
    export let formatDateFn: (dateString: string | Date) => string;
    export let onEdit: (service: PaymentService) => void;

    // const dispatch = createEventDispatcher(); // REMOVED
    let openDeleteDialog = false;

    function handleEditClick() {
        if (onEdit) {
            onEdit(paymentService);
        } else {
            console.warn('onEdit callback not provided to PaymentServiceCard');
        }
    }

    async function confirmDelete() {
        if (!paymentService || !paymentService.id) return;
        try {
            const deletedLink = await loadSpaceSafes<Link>({
                url: `/api/space-safes/payment-services/${paymentService.id}`,
                method: 'DELETE'
            });

            if (deletedLink) { 
                deletePaymentService(paymentService.id);
                openDeleteDialog = false;
            } else {
                console.error('Failed to delete payment service from API');
            }
        } catch (error) {
            console.error('Error deleting payment service:', error);
        }
    }
</script>

<div 
    class="bg-white dark:bg-primary-800 rounded-lg shadow-md overflow-hidden border border-primary-200 dark:border-primary-700 hover:shadow-lg transition-shadow"
    transition:slide={{ duration: 300 }}
>
    <!-- Contenido del payment service -->
    <div class="p-4">
        <h3 class="text-lg font-medium text-primary-900 dark:text-white mb-2">
            {paymentService.description || 'Servicio de Pago'}
        </h3>
        
        <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
                <p class="text-sm text-primary-500 dark:text-primary-400">Monto</p>
                <p class="text-lg font-semibold text-primary-900 dark:text-white">${paymentService.amount}</p>
            </div>
            <div>
                <p class="text-sm text-primary-500 dark:text-primary-400">Fecha de vencimiento</p>
                <p class="text-base text-primary-900 dark:text-white">{formatDateFn(paymentService.expirationDate)}</p>
            </div>
        </div>
    </div>
    
    <!-- Pie de la tarjeta -->
    <div class="bg-primary-50 dark:bg-primary-700 px-4 py-3 flex justify-between space-x-2">
        <Dialog
            bind:open={openDeleteDialog} 
            openButtonClass="bg-primary-700 hover:bg-red-700 p-1 rounded-lg transition-colors duration-300 text-white"
        >
            {#snippet iconButton()}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="24" stroke-dashoffset="24" d="M12 20h5c0.5 0 1 -0.5 1 -1v-14M12 20h-5c-0.5 0 -1 -0.5 -1 -1v-14"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="24;0"/></path><path stroke-dasharray="20" stroke-dashoffset="20" d="M4 5h16"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.2s" values="20;0"/></path><path stroke-dasharray="8" stroke-dashoffset="8" d="M10 4h4M10 9v7M14 9v7"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="8;0"/></path></g></svg>
            {/snippet}

            {#snippet title()}
                Eliminar Servicio de Pago
            {/snippet}

            <div class="space-y-2 w-full">
                <p class="text-primary-700 dark:text-primary-200 grid text-center">¿Estás seguro de eliminar este servicio de pago?
                    <span class="text-primary-500 dark:text-primary-400">
                        Esta acción no se puede deshacer.
                    </span>
                </p>
                <button 
                    type="button" 
                    on:click={confirmDelete} 
                    class="mx-auto gap-2 flex justify-center px-4 py-1 w-48 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="24" stroke-dashoffset="24" d="M12 20h5c0.5 0 1 -0.5 1 -1v-14M12 20h-5c-0.5 0 -1 -0.5 -1 -1v-14"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="24;0"/></path><path stroke-dasharray="20" stroke-dashoffset="20" d="M4 5h16"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.2s" values="20;0"/></path><path stroke-dasharray="8" stroke-dashoffset="8" d="M10 4h4M10 9v7M14 9v7"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="8;0"/></path></g></svg>
                    Eliminar Servicio de Pago
                </button>
            </div>
        </Dialog>

        <button 
            class="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white text-sm rounded transition-colors"
            on:click={handleEditClick}
        >
            Editar
        </button>
    </div>
</div>