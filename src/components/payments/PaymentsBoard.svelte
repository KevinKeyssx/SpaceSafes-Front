<script lang="ts">
    import { onMount } from 'svelte';

    import toast            from 'svelte-french-toast';
	import { Toaster } from 'svelte-french-toast';

    import {
        paymentDetailStore,
        addMultiplePaymentDetails,
        setIsLoadingPaymentDetailStore,
        isLoadingPaymentDetailStore
    }                                       from '@/stores/paymentDetail.Store';
    import {
        paymentServiceStore,
        setIsLoadingPaymentServiceStore,
        setPaymentServices,
        isLoadingPaymentServiceStore
    }                                       from '@/stores/paymentServiceStore';
    import {
        balanceStore,
        setBalances,
        setIsLoadingBalanceStore,
        updateBalance,
        isLoadingBalanceStore
    }                                       from '@/stores/balanceStore';

    import type { PaymentService }  from '@/models/payment-services/payment-service.model';
    import type { Balance }         from '@/models/balance/balance.model';
    import type { PaymentDetail }   from '@/models/payment-detail/payment-detail.model';

    import Input                from '@/components/ui/Inputs/Input.svelte';
    import PaymentCard          from '@/components/payments/PaymentCard.svelte';
    import PaymentDetailCard    from '@/components/payments/PaymentDetailCard.svelte';
    import PatternBackground    from '@/components/ui/PatternBackground.svelte';

    import { loadSpaceSafes } from '@/services/fetch/getSpaceSafes';

    import BalanceCard from './BalanceCard.svelte';
    import { errorToast, successToast } from '@/config/toast/toast.config';
    import LoadIcon from '@/icons/LoadIcon.svelte';
    import AddIcon from '@/icons/AddIcon.svelte';
    import SpaceLoader from '../loader/SpaceLoader.svelte';
    import BalanceCardLoading from './BalanceCardLoading.svelte';
    import OutlineButton from '../ui/Buttons/OutlineButton.svelte';
    import Title from '../ui/Title.svelte';


    let currentMonth = new Date();
    let balanceSelected: Balance | null = null;
    let selectedPendingIDs = new Set<string>();
    let selectedPaidIDs = new Set<string>();
    let pendingSearchQuery = '';
    let porRealizarSearchQuery = ''; // For the middle "Por Realizar" panel
    let paidSearchQuery = ''; // For the rightmost "Realizados" panel
    let paymentCompleted: PaymentService[] = []; // Temporary store for payments marked as paid


    $: displayedBalances = $balanceStore;


    $: realizadosForCurrentMonth = ($paymentDetailStore || []).filter((pd: PaymentDetail) => {
        if (!pd || !pd.payment) return false;

        return pd.payment.year === currentMonth.getFullYear() && 
            pd.payment.month === currentMonth.getMonth() + 1;
    });

    $: pendingPayments = ($paymentServiceStore || []).filter((service: PaymentService) => {
        if (!service || !service.id) return false; // Basic existence check
        // Exclude if permanently paid (already in paymentDetailStore for the current month)
        const isPermanentlyPaid = realizadosForCurrentMonth.some(
            (pd: PaymentDetail) => pd && pd.paymentService && pd.paymentService.id === service.id
        );
        if (isPermanentlyPaid) return false;

        // Exclude if temporarily marked as paid (in paymentCompleted array for 'Por Realizar' column)
        const isTemporarilyCompleted = paymentCompleted.some(
            (pc: PaymentService) => pc.id === service.id
        );
        if (isTemporarilyCompleted) return false;

        return true;
    }).filter(s => s) as PaymentService[]; // .filter(s => s) removes any null/undefined from array if types were looser


    $: paidTotal = filteredPaidPayments ? filteredPaidPayments.reduce((sum, service) => sum + service.amount, 0) : 0;
    $: pendingTotal = pendingPayments.reduce((sum, p: PaymentService) => sum + (p?.amount || 0), 0);
    $: filteredRealizadosDetails = realizadosForCurrentMonth
        .filter((pd: PaymentDetail) => {
            if (!paidSearchQuery.trim()) return true; // Show all if search is empty
            const searchTerm = paidSearchQuery.toLowerCase();
            return (pd.paymentService?.description?.toLowerCase().includes(searchTerm)) ||
                (pd.paymentService?.id?.toLowerCase().includes(searchTerm)) ||
                (pd.amount.toString().toLowerCase().includes(searchTerm));
        });

    $: realizadosTotalAmount = filteredRealizadosDetails.reduce((acc, pd) => acc + pd.amount, 0);

    $: filteredPendingPayments = pendingPayments.filter((p: PaymentService) => 
        p && (p.description?.toLowerCase() || '').includes(pendingSearchQuery.toLowerCase())
    ).filter(s => s) as PaymentService[];

    $: filteredPaidPayments = paymentCompleted.filter((p: PaymentService) => {
        if (!porRealizarSearchQuery.trim()) return true;
        const searchTerm = porRealizarSearchQuery.toLowerCase();
        return p && (p.description?.toLowerCase() || '').includes(searchTerm) ||
            (p.id?.toLowerCase().includes(searchTerm)) ||
            (p.amount.toString().toLowerCase().includes(searchTerm));
    });


    async function loadBalanceStore() {
        if ( $balanceStore.length > 0 ) {
            return;
        }

        setIsLoadingBalanceStore( true );
        const balanceList = await loadSpaceSafes<Balance[]>({ url: '/api/space-safes/balances' });

        if (  balanceList === null ) {
            setIsLoadingBalanceStore( false );
            return;
        }

        setBalances( balanceList );
        setIsLoadingBalanceStore( false );
    }


    async function loadPaymentSerice() {
        if ( $paymentServiceStore.length > 0 ) {
            return;
        }

        setIsLoadingPaymentServiceStore( true );
        const paymentServiceList = await loadSpaceSafes<PaymentService[]>({ url: '/api/space-safes/payment-services' });

        if (  paymentServiceList === null ) {
            setIsLoadingPaymentServiceStore( false );
            return;
        }

        setPaymentServices( paymentServiceList );
        // setIsLoadingPaymentServiceStore( false );
    }


    async function loadPaymentDetailStore() {
        const paymentDetailByDate =  $paymentDetailStore.filter( pds =>
            pds.payment.month === currentMonth.getMonth() + 1 &&
            pds.payment.year === currentMonth.getFullYear()
        ).length > 0;

        if ( paymentDetailByDate ) {
            return;
        }

        setIsLoadingPaymentDetailStore( true );

        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth() + 1;

        const paymentDetailList = await loadSpaceSafes<PaymentDetail[]>({
            url: `/api/payment-details/${month}/${year}`
        });

        if (  paymentDetailList === null ) {
            setIsLoadingPaymentDetailStore( false );
            return;
        }

        setIsLoadingPaymentDetailStore( false );
        setIsLoadingPaymentServiceStore( false );
        addMultiplePaymentDetails( paymentDetailList );
    }


    onMount( async () => {
        await Promise.all([
            loadBalanceStore(),
            loadPaymentSerice(),
            loadPaymentDetailStore(),
        ]);

        if ( displayedBalances && displayedBalances.length > 0 ) {
            const firstBalance = displayedBalances[0];

            if ( firstBalance ) { 
                balanceSelected = firstBalance;
            }
        }
    });


    async function changeMonth( increment: number ): Promise<void> {
        const newDate = new Date( currentMonth );
        newDate.setDate(1);
        newDate.setMonth(newDate.getMonth() + increment);
        currentMonth = newDate;
        selectedPendingIDs = new Set<string>();
        selectedPaidIDs = new Set<string>();
        await loadPaymentDetailStore();
    }

    async function changeToToday(): Promise<void> {
        const newDate = new Date();
        newDate.setDate(1);
        newDate.setMonth(newDate.getMonth());
        currentMonth = newDate;
        selectedPendingIDs = new Set<string>();
        selectedPaidIDs = new Set<string>();
        await loadPaymentDetailStore();
    }


    function formatMonthYear(date: Date): string {
        return new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
    }


    function togglePendingSelection(id: string | undefined): void {
        if (!id) return;
        selectedPendingIDs.has(id) ? selectedPendingIDs.delete(id) : selectedPendingIDs.add(id);
        selectedPendingIDs = new Set([...selectedPendingIDs]);
    }


    function togglePaidSelection(id: string | undefined): void {
        if (!id) return;
        selectedPaidIDs.has(id) ? selectedPaidIDs.delete(id) : selectedPaidIDs.add(id);
        selectedPaidIDs = new Set([...selectedPaidIDs]);
    }


    function handleBalanceSelection(balance: Balance | null): void {
        balanceSelected = balance;
    }


    async function handleMoveToPaid(): Promise<void> {
        if (selectedPendingIDs.size === 0 || !balanceSelected) {
            alert('Seleccione pagos pendientes y un balance.');
            return;
        }

        const servicesToComplete: PaymentService[] = [];
        let totalAmountToPay = 0;

        pendingPayments.forEach((service: PaymentService) => {
            if (service && service.id && selectedPendingIDs.has(service.id)) {
                // Create a new object for paymentCompleted, assigning the selected balance
                servicesToComplete.push({
                    ...service,
                    balance: balanceSelected!, 
                });
                totalAmountToPay += service.amount;
            }
        });

        if ( totalAmountToPay > balanceSelected.balance ) {
            alert( 'No tienes saldo suficiente, cambia de balance. ');
            return;
        }

        if ( servicesToComplete.length > 0 ) {
            paymentCompleted = [...paymentCompleted, ...servicesToComplete];
            
            const updatedBal: Balance = {
                ...balanceSelected,
                balance: balanceSelected.balance - totalAmountToPay,
            };
            updateBalance(updatedBal);
            selectedPendingIDs = new Set<string>();
        }

    }

    async function handleMoveToPending(): Promise<void> {
        if (selectedPaidIDs.size === 0) {
            alert('Seleccione pagos realizados para mover a pendientes.');
            return;
        }

        const updatedTemporarilyCompleted: PaymentService[] = [];
        const balanceRestorationMap = new Map<string, { amountToRestore: number, balanceData: Balance }>();

        paymentCompleted.forEach(service => {
            if (service && service.id && selectedPaidIDs.has(service.id)) {
                // This service is being moved back to pending
                if (service.balance && service.balance.id) {
                    const mapEntry = balanceRestorationMap.get(service.balance.id);
                    const currentAmount = mapEntry ? mapEntry.amountToRestore : 0;
                    balanceRestorationMap.set(service.balance.id, {
                        amountToRestore: currentAmount + service.amount,
                        balanceData: service.balance // Storing the balance object associated at time of payment
                    });
                }
            } else {
                updatedTemporarilyCompleted.push(service); // Keep in paymentCompleted
            }
        });

        paymentCompleted = updatedTemporarilyCompleted;
        console.log('🚀 ~ file: PaymentsBoard.svelte:270 ~ updatedTemporarilyCompleted:', updatedTemporarilyCompleted)

        balanceRestorationMap.forEach(data => {
            const storeBalance = ($balanceStore || []).find(b => b.id === data.balanceData.id);
            const balanceToUpdate = storeBalance || data.balanceData; // Prefer store's current state

            const updatedBal: Balance = {
                ...balanceToUpdate,
                balance: balanceToUpdate.balance + data.amountToRestore,
            };
            updateBalance(updatedBal);
        });

        selectedPaidIDs = new Set<string>();
    }


    function formatCurrency(value: number, currencyCode: string = 'USD'): string {
        return new Intl.NumberFormat('es-ES', { style: 'currency', currency: currencyCode, minimumFractionDigits: 2 }).format(value);
    }



    function transformPaymentList(paymentList: PaymentService[]): {
        month: number;
        year: number;
        paymentDetails: {
            amount: number;
            balanceId: string;
            paymentServiceId: string;
        }[];
    } {
        const paymentDetails = paymentList.map(payment => ({
            amount              : payment.amount,
            balanceId           : payment.balance!.id!,
            paymentServiceId    : payment.id,
        }));

        return {
            month: currentMonth.getMonth() + 1,
            year: currentMonth.getFullYear(),
            paymentDetails,
        };
    }


    let isLoadingSavePayment = false 
    async function savePayment() {
        if ( paymentCompleted.length === 0 ) {
            toast.error( 'No hay pagos marcados como realizados para registrar.', errorToast() );
            return;
        }

        isLoadingSavePayment = true;
        console.log('🚀 ~ file: PaymentsBoard.svelte:225 ~ paymentCompleted:', paymentCompleted)

        const transformedPaymentList = transformPaymentList(paymentCompleted);
        console.log('🚀 ~ file: PaymentsBoard.svelte:226 ~ transformedPaymentList:', transformedPaymentList)


        const savedPaymentDetail = await loadSpaceSafes<PaymentDetail[]>({
            url: `/api/space-safes/payment-details`,
            method: 'POST',
            data: transformedPaymentList
        });
        
        console.log('🚀 ~ file: PaymentsBoard.svelte:318 ~ savedPaymentDetail:', savedPaymentDetail)

        if ( !savedPaymentDetail ) {
            // TODO: Show toast error
            toast.error( 'Error al registrar los pagos', errorToast() );
            return;
        }

        addMultiplePaymentDetails( savedPaymentDetail );
        isLoadingSavePayment = false;

        paymentCompleted = [];
        selectedPaidIDs = new Set<string>();
        selectedPendingIDs = new Set<string>();
        toast.success( 'Pagos registrados correctamente.', successToast() );
    }


    function handleMoveAllToPaid(): void {
        if (!balanceSelected) {
            toast.error( 'Por favor, seleccione un balance primero.', errorToast() );
            return;
        }

        if ( filteredPendingPayments.length === 0 ) {
            toast.error( 'No hay pagos pendientes para mover.', errorToast() );
            return;
        }

        const amountToMove = filteredPendingPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

        if (balanceSelected.balance < amountToMove) {
            toast.error( 'El balance seleccionado no tiene fondos suficientes.', errorToast() );
            return; 
        }

        const newBalanceAmount = balanceSelected.balance - amountToMove;

        filteredPendingPayments = filteredPendingPayments.map( fp => ({
            ...fp,
            balance: balanceSelected!
        }) );

        paymentCompleted = [...paymentCompleted, ...filteredPendingPayments];

        const updatedBalanceData = { ...balanceSelected, balance: newBalanceAmount };
        updateBalance(updatedBalanceData);
        balanceSelected = updatedBalanceData;
    }

    function handleMoveAllToPendingSearchFromTPerform(): void {
        if (!balanceSelected) {
            toast.error( 'Por favor, seleccione un balance primero (para devolver el monto).', errorToast() );
            return;
        }
        if (paymentCompleted.length === 0) {
            toast.error( 'No hay pagos en "Por Realizar" para mover.', errorToast() );
            return;
        }

        const amountToReturn = filteredPaidPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
        const newBalanceAmount = balanceSelected.balance + amountToReturn;
        const idsToMove = new Set(filteredPaidPayments.map(p => p.id));

        // Update paymentCompleted by removing only those services that were moved
        paymentCompleted = paymentCompleted.filter(p => !idsToMove.has(p.id));

        const updatedBalanceData = { ...balanceSelected, balance: newBalanceAmount };
        updateBalance(updatedBalanceData);
        balanceSelected = updatedBalanceData;
    }
</script>

<Toaster />

<div class="space-y-6 min-h-screen">
    <!-- Month Navigation & Title -->
    <Title>
        <div slot="title">
            Gestión de Pagos Mensuales
        </div>

        <div class="z-10 flex items-center space-x-3" slot="content">
            <OutlineButton
                onClick={() => changeMonth(-1)}
                ariaLabel="Anterior"
                >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-dasharray="10" stroke-dashoffset="10" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l5 -5M9 12l5 5"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="10;0"/></path></svg>
            </OutlineButton>

            <span class="font-semibold text-lg text-primary-500">{formatMonthYear(currentMonth)}</span>

            <OutlineButton
                onClick={() => changeMonth(1)}
                ariaLabel="Siguiente"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-dasharray="10" stroke-dashoffset="10" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12l-5 -5M15 12l-5 5"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="10;0"/></path></svg>
            </OutlineButton>

            <OutlineButton
                onClick={changeToToday}
                ariaLabel="Hoy"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="14" height="0" x="5" y="5" fill="currentColor"><animate fill="freeze" attributeName="height" begin="0.6s" dur="0.2s" values="0;3"/></rect><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="64" stroke-dashoffset="64" d="M12 4h7c0.55 0 1 0.45 1 1v14c0 0.55 -0.45 1 -1 1h-14c-0.55 0 -1 -0.45 -1 -1v-14c0 -0.55 0.45 -1 1 -1Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="64;0"/></path><path stroke-dasharray="4" stroke-dashoffset="4" d="M7 4v-2M17 4v-2"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="4;0"/></path><path stroke-dasharray="12" stroke-dashoffset="12" d="M7 11h10"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.2s" values="12;0"/></path><path stroke-dasharray="8" stroke-dashoffset="8" d="M7 15h7"><animate fill="freeze" attributeName="stroke-dashoffset" begin="1s" dur="0.2s" values="8;0"/></path></g></svg>
            </OutlineButton>
        </div>
    </Title>

    <!-- Balances Section -->
    <section aria-labelledby="balances-title" class="mb-6">
        <h2 id="balances-title" class="text-xl font-semibold mb-3 text-primary-500 dark:text-primary-400">
            Mis Balances ({displayedBalances ? displayedBalances.length : 0})
        </h2>

        {#if $isLoadingBalanceStore}
        <div class="animate-slide-up grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-10 gap-4">
            {#each [1,2,3,4,5,6,7,8,9,10] }
                <BalanceCardLoading />
            {/each}
        </div>
        {:else}
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-10 gap-4">
                {#each displayedBalances as balance (balance.id)}
                    <BalanceCard
                        {balance}
                        isSelected={balanceSelected?.id === balance.id}
                        onClick={() => handleBalanceSelection(balance)}
                    />
                {/each}
            </div>
        {/if}
    </section>

    <!-- Payments Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Pending Payments Column -->
        <section
            aria-labelledby="pending-payments-title"
            class="animate-slide-up relative h-[calc(100vh-350px)] bg-white dark:bg-primary-800 p-4 rounded-lg shadow border border-primary-200 dark:border-primary-700 flex flex-col space-y-4"
        >
            <PatternBackground patternId="balanceGrid-pending" />

            <div class="flex justify-between items-center">
                <h3 id="pending-payments-title" class="text-lg font-semibold text-orange-500 dark:text-orange-400">
                    Pendientes ({ filteredPendingPayments ? filteredPendingPayments.length : 0 })
                </h3>

                <p class="font-semibold text-orange-500 dark:text-orange-400">
                    Total: { formatCurrency( pendingTotal )}
                </p>
            </div>

            <div class="grid grid-cols-[1fr_auto] gap-2">
                <Input
                    type="search"
                    placeholder="Buscar en pendientes..."
                    bind:value={pendingSearchQuery}
                />

                <button
                    on:click={handleMoveAllToPaid}
                    disabled={pendingPayments.length === 0 || !balanceSelected}
                    class="flex items-center gap-0 w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Marcar todos como pagados"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-dasharray="10" stroke-dashoffset="10" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12l-5 -5M15 12l-5 5"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="10;0"/></path></svg>
                </button>
            </div>

            {#if $isLoadingPaymentServiceStore}
                <div class="flex items-center justify-center h-full">
                    <SpaceLoader />
                </div>
            {:else}

            <div class="flex-grow overflow-y-auto space-y-3 px-2 py-1">
                {#each filteredPendingPayments as payment (payment.id)}
                    <PaymentCard 
                        paymentService={payment} 
                        isSelected={selectedPendingIDs.has(payment.id)} 
                        handleClick={() => togglePendingSelection(payment.id)}
                        type="pending"
                    />
                {:else}
                    <p class="text-center text-primary-500 dark:text-primary-400 py-4">No hay pagos pendientes para este mes o según tu búsqueda.</p>
                {/each}
            </div>

            <button 
                on:click={handleMoveToPaid} 
                disabled={selectedPendingIDs.size === 0 || !balanceSelected}
                class="mt-auto w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Marcar como Por Realizar ({selectedPendingIDs.size})
            </button>
            {/if}
        </section>

        <!-- Pagos por realizar -->
        <section
            aria-labelledby="paid-payments-title"
            class="animate-slide-up relative h-[calc(100vh-350px)] bg-white dark:bg-primary-800 p-4 rounded-lg shadow-lg border border-primary-200 dark:border-primary-700 flex flex-col space-y-4"
        >
            <PatternBackground patternId="balanceGrid-pending" />

            <div class="flex justify-between items-center">
                <h3 id="paid-payments-title" class="text-lg font-semibold text-green-500 dark:text-green-400">
                    Por Realizar ({ filteredPaidPayments ? filteredPaidPayments.length : 0 })
                </h3>

                <p class="font-semibold text-green-500 dark:text-green-400">
                    Total: {formatCurrency(paidTotal)}
                </p>
            </div>

            <div class="grid grid-cols-[0.1fr_1fr_auto] gap-2">
                <button
                    on:click={handleMoveAllToPendingSearchFromTPerform}
                    disabled={paymentCompleted.length === 0 || !balanceSelected}
                    class="flex items-center gap-0 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Marcar todos como realizados"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-dasharray="10" stroke-dashoffset="10" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l5 -5M9 12l5 5"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="10;0"/></path></svg>
                </button>

                <Input
                    type="search"
                    placeholder="Buscar en por realizar..."
                    bind:value={porRealizarSearchQuery}
                />
            </div>

            <div class="flex-grow overflow-y-auto space-y-3 px-2 py-1">
                {#each filteredPaidPayments as payment (payment.id)}
                    <PaymentCard 
                        paymentService={payment} 
                        isSelected={selectedPaidIDs.has(payment.id)} 
                        handleClick={() => togglePaidSelection(payment.id)}
                        type="pending"
                    />
                {:else}
                    <p class="text-center text-primary-500 dark:text-primary-400 py-4">No hay pagos realizados para este mes o según tu búsqueda.</p>
                {/each}
            </div>

            <button 
                on:click={handleMoveToPending} 
                disabled={selectedPaidIDs.size === 0 || !balanceSelected} 
                class="mt-auto w-full bg-primary-400 hover:bg-primary-500 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed">
                Mover a Pendientes ({selectedPaidIDs.size})
            </button>

            <button 
                on:click={savePayment}
                disabled={paymentCompleted.length === 0 || isLoadingSavePayment}
                class="flex items-center gap-2 justify-center w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {#if isLoadingSavePayment}
                    <LoadIcon />
                {:else}
                    <AddIcon />
                {/if}

                Registrar Pagos
            </button>
        </section>

        <!-- Pagos realizados -->
        <section
            aria-labelledby="realizados-payments-title"
            class="animate-slide-up relative h-[calc(100vh-350px)] bg-white dark:bg-primary-800 p-4 rounded-lg shadow-lg border border-primary-200 dark:border-primary-700 flex flex-col space-y-4"
        >
            <PatternBackground patternId="balanceGrid-pending" />

            <div class="flex justify-between items-center">
                <h3 id="realizados-payments-title" class="text-lg font-semibold text-primary-500 dark:text-primary-400">
                    Realizados ({ filteredRealizadosDetails.length })
                </h3>

                <p class="font-semibold text-primary-500 dark:text-primary-400">
                    Total: {formatCurrency(realizadosTotalAmount)}
                </p>
            </div>

            <Input
                type="search"
                placeholder="Buscar en realizados..."
                bind:value={paidSearchQuery}
            />

            {#if $isLoadingPaymentDetailStore}
                <div class="flex items-center justify-center h-full">
                    <SpaceLoader />
                </div>
            {:else}
                {#each filteredRealizadosDetails as paymentDetail (paymentDetail.id)}
                    <PaymentDetailCard {paymentDetail} />
                {:else}
                    <p class="text-center text-primary-500 dark:text-primary-400 py-4">No hay pagos registrados o que coincidan con tu búsqueda.</p>
                {/each}
            {/if}
        </section>
    </div>
</div>
