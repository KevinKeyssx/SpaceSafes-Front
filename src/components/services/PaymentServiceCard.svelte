<script lang="ts">
    import { slide } from 'svelte/transition';

    import toast from "svelte-french-toast";

    import {
        errorToast,
        successToast
    }                               from "@/config/toast/toast.config";
    import DeleteButton             from '@/components/ui/Buttons/DeleteButton.svelte';
    import GlowEffects              from '@/components/ui/GlowEffects.svelte';
    import PatternBackground        from '@/components/ui/PatternBackground.svelte';
    import { loadSpaceSafes }       from '@/services/fetch/getSpaceSafes';
    import { deletePaymentService } from '@/stores/paymentServiceStore';
    import type { Link }            from '@/models/links/link.model';
    import type { PaymentService }  from '@/models/payment-services/payment-service.model'; 


    export let paymentService: PaymentService;
    export let formatDateFn: (dateString: string | Date) => string;
    export let onEdit: () => void;


    let openDeleteDialog = false;
    let isLoadingDelete = false;


    async function confirmDelete() {
        if ( !paymentService || !paymentService.id ) return;

        isLoadingDelete = true;

        const deletedLink = await loadSpaceSafes<Link>({
            url: `/api/space-safes/payment-services/${paymentService.id}`,
            method: 'DELETE'
        });

        if ( !deletedLink ) { 
            isLoadingDelete = false;
            toast.error( 'Error al eliminar el servicio.', errorToast() );

            return;
        }

        console.error('Failed to delete payment service from API');

        deletePaymentService(paymentService.id);

        openDeleteDialog = false;
        isLoadingDelete = false;
        toast.success( 'Servicio eliminado correctamente.', successToast() );
    }
</script>

<card
    class="relative animate-slide-up bg-white dark:bg-primary-800 rounded-lg shadow-md overflow-hidden border border-primary-200 dark:border-primary-700 hover:shadow-lg transition-shadow"
    transition:slide={{ duration: 300 }}
>
    <PatternBackground patternId="linkdetail" />
    <GlowEffects />

    <header class="p-4">
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
    </header>

    <footer class="bg-primary-50 dark:bg-primary-700 px-4 py-3 flex justify-between space-x-2">
        <DeleteButton
            confirmDelete={confirmDelete}
            name="Servicio de Pago"
            disabled={isLoadingDelete}
            styles = ''
        />

        <button 
            class="z-10 px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white text-sm rounded transition-colors"
            on:click={onEdit}
        >
            Editar
        </button>
    </footer>
</card>