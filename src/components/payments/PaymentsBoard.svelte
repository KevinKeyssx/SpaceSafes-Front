<script context="module" lang="ts">
    export interface Balance {
        id: string;
        name: string;
        currentAmount: number;
        currency: string;
        // ... any other balance-specific fields like 'type', 'bankName', etc. that BalanceCard might need
    }
</script>

<script lang="ts">
    import { onMount, tick } from 'svelte';
    import { writable, type Writable } from 'svelte/store';
    // Stores - Assuming paymentServiceStore is correctly set up elsewhere
    import { paymentServiceStore } from '@/stores/paymentServiceStore';
    import type { PaymentService as BackendPaymentService } from '@/models/payment-services/payment-service.model';

    interface ClientPaymentService extends BackendPaymentService {
        isSavedToDB?: boolean;
    } 
    import Input from '@/components/ui/Inputs/Input.svelte';
    import BalanceCard from './BalanceCard.svelte';
    import PaymentCard from './PaymentCard.svelte';

    // Type definitions
    // Ensure PaymentService is correctly defined in your store or models
    // For example: 
    // export interface PaymentService {
    //    id: string;
    //    description: string;
    //    amount: number;
    //    currency: string;
    //    dueDate?: string; // Or your date field for determining month
    //    status?: 'pending' | 'paid' | 'overdue'; // More granular status if needed
    //    paidDate?: string;
    //    balanceId?: string; // ID of the balance used for payment
    //    recurring?: boolean;
    //    nextDueDate?: string; // For recurring payments
    //    // ... other relevant fields
    // }



    // Component State
    let currentMonth = new Date();
    
    let allUserPaymentServices: ClientPaymentService[] = []; // Raw from $paymentServiceStore subscription
    let pendingPayments: ClientPaymentService[] = []; // Filtered for current month & pending status
    let clientSidePaidPayments: ClientPaymentService[] = []; // User-marked as paid in this session

    let selectedPendingIDs = writable(new Set<string>());
    let selectedPaidIDs = writable(new Set<string>());

    // Balances - for now, mock data. Replace with store subscription.
    let displayedBalances: Writable<Balance[]> = writable([
        { id: 'bal1', name: 'Cuenta Principal', currentAmount: 1500.75, currency: 'EUR' },
        { id: 'bal2', name: 'Ahorros', currentAmount: 5300.00, currency: 'EUR' },
        { id: 'bal3', name: 'Efectivo', currentAmount: 350.00, currency: 'EUR' },
    ]);
    let selectedBalanceForPayment: Writable<Balance | null> = writable(null);

    let pendingSearchQuery = '';
    let paidSearchQuery = '';

    // --- Svelte Store Subscriptions ---
    paymentServiceStore.subscribe(backendServices => {
        allUserPaymentServices = backendServices.map(p => ({ ...p, isSavedToDB: true }));
        loadPaymentsForMonth(currentMonth); // Reload when underlying store changes
    });

    // Initialize selectedBalanceForPayment if balances exist
    displayedBalances.subscribe(balances => {
        if (balances.length > 0 && !$selectedBalanceForPayment) {
            selectedBalanceForPayment.set(balances[0]);
        }
    });

    // --- Totals (Reactive) ---
    $: pendingTotal = pendingPayments.reduce((sum, p) => sum + p.amount, 0);
    $: paidTotal = clientSidePaidPayments.reduce((sum, p) => sum + p.amount, 0);

    // --- Filtered Lists (Reactive) ---
    $: filteredPendingPayments = pendingPayments.filter(p => 
        (p.description?.toLowerCase() || '').includes(pendingSearchQuery.toLowerCase())
    );

    $: filteredPaidPayments = clientSidePaidPayments.filter(p => 
        (p.description?.toLowerCase() || '').includes(paidSearchQuery.toLowerCase())
    );

    // --- Lifecycle ---
    onMount(() => {
        // Initial load is handled by store subscription
        // If $paymentServiceStore might be populated async after mount, ensure loadPaymentsForMonth is robust
        if ($displayedBalances.length > 0) {
           selectedBalanceForPayment.set($displayedBalances[0]);
        }
    });

    // --- Month Navigation ---
    function changeMonth(increment: number): void {
        const newDate = new Date(currentMonth);
        newDate.setDate(1); 
        newDate.setMonth(newDate.getMonth() + increment);
        currentMonth = newDate;
        loadPaymentsForMonth(currentMonth);
    }

    function formatMonthYear(date: Date): string {
        return new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
    }

    // --- Data Loading & Filtering ---
    function loadPaymentsForMonth(date: Date): void {
        const year = date.getFullYear();
        const month = date.getMonth();

        // Logic to determine if a PaymentService is 'pending' for the currentMonth
        // This assumes PaymentService has a dueDate or similar and lacks a paidDate or has status 'pending'
        pendingPayments = allUserPaymentServices.filter(p => {
            const dueDate = p.expirationDate ? new Date(p.expirationDate) : null; // Use appropriate date field
            if (!dueDate) return false;
            // Adjust for UTC if dates are stored in UTC to avoid timezone issues with getMonth/getFullYear
            const dueYear = dueDate.getUTCFullYear();
            const dueMonth = dueDate.getUTCMonth();
            
            const isCurrentMonth = dueYear === year && dueMonth === month;
            // Define what makes a payment 'pending' for this month (e.g., not paid yet, or explicit status)
            // This might involve checking a `p.status` or if `p.paidDate` is null/in the future
            const isPendingStatus = !p.paidDate; // Example: if it has no paidDate, it's pending for its due month
            
            return isCurrentMonth && isPendingStatus;
        });

        // Logic for 'paid' payments for the currentMonth
        // These would typically be services that *were* paid *within* this specific month.
        clientSidePaidPayments = allUserPaymentServices.filter(p => {
            if (!p.paidDate) return false;
            const paidDate = new Date(p.paidDate);
            const paidYear = paidDate.getUTCFullYear();
            const paidMonth = paidDate.getUTCMonth();
            return paidYear === year && paidMonth === month && p.balanceId !== undefined; // Has been associated with a balance
        });

        // Reset selections when month changes
        selectedPendingIDs.update(s => { s.clear(); return s; });
        selectedPaidIDs.update(s => { s.clear(); return s; });
        
        tick(); // Ensure UI updates after data changes
    }

    // --- Selection Handling ---
    function togglePendingSelection(id: string): void {
        selectedPendingIDs.update(set => {
            set.has(id) ? set.delete(id) : set.add(id);
            return set;
        });
    }

    function togglePaidSelection(id: string): void {
        selectedPaidIDs.update(set => {
            set.has(id) ? set.delete(id) : set.add(id);
            return set;
        });
    }

    function handleBalanceSelection(balance: Balance | null): void {
        selectedBalanceForPayment.set(balance);
    }

    // --- Core Actions (Implement these with API calls and store updates) ---
    async function handleMoveToPaid(): Promise<void> {
        if ($selectedPendingIDs.size === 0 || !$selectedBalanceForPayment) {
            alert('Seleccione pagos pendientes y un balance.');
            return;
        }
        const balance = $selectedBalanceForPayment;
        const paymentsToMove: ClientPaymentService[] = [];
        
        pendingPayments = pendingPayments.filter(p => {
            if ($selectedPendingIDs.has(p.id)) {
                paymentsToMove.push({...p, balanceId: balance.id, paidDate: new Date().toISOString(), status: 'paid', isSavedToDB: false}); // Mark as paid
                return false; // Remove from pending
            }
            return true;
        });

        clientSidePaidPayments = [...clientSidePaidPayments, ...paymentsToMove];
        
        // Update balance (client-side first)
        const totalAmountToPay = paymentsToMove.reduce((sum, p) => sum + p.amount, 0);
        displayedBalances.update(bals => bals.map(bal => 
            bal.id === balance.id ? { ...bal, currentAmount: bal.currentAmount - totalAmountToPay } : bal
        ));

        selectedPendingIDs.update(s => { s.clear(); return s; });
        console.log('Moved to paid (client-side):', paymentsToMove);
        await tick();
    }

    async function handleMoveToPending(): Promise<void> {
        if ($selectedPaidIDs.size === 0) {
            alert('Seleccione pagos realizados para mover a pendientes.');
            return;
        }
        const paymentsToRevert: ClientPaymentService[] = [];
        const balanceUpdates: { balanceId: string; amount: number }[] = [];

        clientSidePaidPayments = clientSidePaidPayments.filter(p => {
            if ($selectedPaidIDs.has(p.id)) {
                if (p.balanceId) {
                    balanceUpdates.push({ balanceId: p.balanceId, amount: p.amount });
                }
                // Remove balanceId and paidDate, effectively making it pending for its due month
                // The status field might not be strictly necessary if paidDate is the source of truth for paid status
                paymentsToRevert.push({...p, balanceId: undefined, paidDate: undefined, status: 'pending', isSavedToDB: false }); 
                return false; // Remove from client-side paid
            }
            return true;
        });

        // Add to pending only if they belong to the current displayed month
        // Or, more robustly, let loadPaymentsForMonth re-filter them from allUserPaymentServices after backend update
        // For now, let's add them to pendingPayments directly if they fit the current month's criteria.
        const currentMonthDate = new Date(currentMonth);
        const currentYear = currentMonthDate.getFullYear();
        const currentM = currentMonthDate.getMonth();

        paymentsToRevert.forEach(pTR => {
            const dueDate = pTR.expirationDate ? new Date(pTR.expirationDate) : null;
            if (dueDate && dueDate.getUTCFullYear() === currentYear && dueDate.getUTCMonth() === currentM) {
                pendingPayments = [...pendingPayments, pTR];
            }
            // If not for current month, they will be picked up when user navigates to their respective month,
            // assuming allUserPaymentServices is updated after API call.
        });
        pendingPayments.sort((a, b) => (new Date(a.expirationDate || 0)).getTime() - (new Date(b.expirationDate || 0)).getTime());

        // Update balances
        displayedBalances.update(bals => {
            const newBalances = bals.map(bal => {
                const relevantUpdate = balanceUpdates.find(upd => upd.balanceId === bal.id);
                if (relevantUpdate) {
                    return { ...bal, currentAmount: bal.currentAmount + relevantUpdate.amount };
                }
                return bal;
            });
            return newBalances;
        });
        
        selectedPaidIDs.update(s => { s.clear(); return s; });
        console.log('Moved to pending (client-side):', paymentsToRevert);
        await tick(); 
        // TODO: API Call - update payment status on backend for each reverted payment.
        // This should ideally update allUserPaymentServices via paymentServiceStore, triggering a reactive reload.
        // For example: await paymentService.markAsPending(paymentsToRevert.map(p => p.id));
        // After successful API call, paymentServiceStore should be updated.
    }

    async function handleSavePaidPayments(): Promise<void> {
        const paymentsToSave = clientSidePaidPayments.filter(p=>!p.isSavedToDB); // Example: Add a flag like isSavedToDB
        if (paymentsToSave.length === 0) {
            alert('No hay nuevos pagos realizados para guardar en la base de datos.');
            return;
        }
        console.log('Guardando en BD (simulado):', paymentsToSave);
        // TODO: API Call to save each payment in paymentsToSave
        // For each payment:
        //   - Call your API (e.g., updatePaymentService(payment.id, { status: 'paid', paidDate: payment.paidDate, balanceId: payment.balanceId }))
        //   - On success, update paymentServiceStore if needed, or mark clientSidePaidPayment as 'isSavedToDB = true'
        //   - Handle API errors
        alert('Simulación: Pagos guardados en BD. Implementar API real.');
        // Example: clientSidePaidPayments.forEach(p => p.isSavedToDB = true); clientSidePaidPayments = [...clientSidePaidPayments];
    }

    // --- Formatting Utilities ---
    function formatCurrency(amount: number, currency = 'EUR'): string {
        return new Intl.NumberFormat('es-ES', { style: 'currency', currency }).format(amount);
    }

    // --- Mock Payment Card (Replace with your actual PaymentCard.svelte component) ---
    // This is a simplified stand-in for demonstration.
    // Your PaymentCard should emit a 'toggle' event or accept selection state via prop.


</script>

<div class="p-4 md:p-6 space-y-6 bg-gray-50 dark:bg-gray-800 min-h-screen text-gray-800 dark:text-gray-200">
    <!-- Balances Display Section -->
    <section aria-labelledby="balances-title">
        <h2 id="balances-title" class="text-xl font-semibold mb-3">Mis Balances</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
            {#each $displayedBalances as balance (balance.id)}
                <BalanceCard 
                    {balance} 
                    isSelected={$selectedBalanceForPayment?.id === balance.id} 
                    on:select={(event) => handleBalanceSelection(event.detail)} 
                />
            {:else}
                <p class="col-span-full text-center text-gray-500 dark:text-gray-400 py-4">No hay balances para mostrar.</p>
            {/each}
        </div>
    </section>

    <!-- Month Navigation & Title -->
    <header class="flex flex-col sm:flex-row justify-between items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 mb-6">
        <h1 class="text-2xl font-bold mb-2 sm:mb-0">Gestión de Pagos Mensuales</h1>
        <div class="flex items-center space-x-2">
            <button on:click={() => changeMonth(-1)} class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-primary-600 dark:text-primary-400" aria-label="Mes anterior">
                &lt; Anterior
            </button>
            <h2 class="text-lg font-semibold tabular-nums w-40 text-center">{formatMonthYear(currentMonth)}</h2>
            <button on:click={() => changeMonth(1)} class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-primary-600 dark:text-primary-400" aria-label="Mes siguiente">
                Siguiente &gt;
            </button>
        </div>
    </header>

    <!-- Main Content: Pending and Paid Columns -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Pending Payments Column -->
        <section aria-labelledby="pending-payments-title" class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 flex flex-col space-y-4">
            <div class="flex justify-between items-center">
                <h3 id="pending-payments-title" class="text-lg font-semibold">Pendientes ({filteredPendingPayments.length})</h3>
                <p class="font-semibold text-orange-500 dark:text-orange-400">Total: {formatCurrency(pendingTotal)}</p>
            </div>
            <Input type="search" placeholder="Buscar en pendientes..." bind:value={pendingSearchQuery} label="Filtrar pendientes" id="pendingSearch" />
            
            <div class="flex-grow min-h-[300px] max-h-[45vh] overflow-y-auto space-y-2 p-1 border dark:border-gray-700 rounded-md">
                {#each filteredPendingPayments as payment (payment.id)}
                    <PaymentCard 
                        {payment } 
                        isSelected={$selectedPendingIDs.has(payment.id)} 
                        on:toggleSelect={(event) => togglePendingSelection(event.detail.id)} 
                    />
                {:else}
                    <p class="text-sm text-gray-500 dark:text-gray-400 text-center py-10">No hay pagos pendientes para este mes o filtro.</p>
                {/each}
            </div>

            {#if pendingPayments.length > 0}
                <div class="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                    <select bind:value={$selectedBalanceForPayment} 
                            class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-primary-500 focus:border-primary-500">
                        <option value={null} disabled>Seleccione un balance...</option>
                        {#each $displayedBalances as balance (balance.id)}
                            <option value={balance}>{balance.name} ({formatCurrency(balance.currentAmount, balance.currency)})</option>
                        {/each}
                    </select>
                    <button on:click={handleMoveToPaid} 
                            class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={$selectedPendingIDs.size === 0 || !$selectedBalanceForPayment}>
                        Marcar como Pagado &rarr;
                    </button>
                </div>
            {/if}
        </section>

        <!-- Paid Payments Column -->
        <section aria-labelledby="paid-payments-title" class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 flex flex-col space-y-4">
            <div class="flex justify-between items-center">
                <h3 id="paid-payments-title" class="text-lg font-semibold">Realizados ({filteredPaidPayments.length})</h3>
                <p class="font-semibold text-green-600 dark:text-green-400">Total: {formatCurrency(paidTotal)}</p>
            </div>
            <Input type="search" placeholder="Buscar en realizados..." bind:value={paidSearchQuery} label="Filtrar realizados" id="paidSearch" />

            <div class="flex-grow min-h-[300px] max-h-[45vh] overflow-y-auto space-y-2 p-1 border dark:border-gray-700 rounded-md">
                {#each filteredPaidPayments as payment (payment.id)}
                    <PaymentCard 
                        {payment} 
                        isSelected={$selectedPaidIDs.has(payment.id)} 
                        on:toggleSelect={(event) => togglePaidSelection(event.detail.id)} 
                    />
                {:else}
                    <p class="text-sm text-gray-500 dark:text-gray-400 text-center py-10">No hay pagos realizados para este mes o filtro.</p>
                {/each}
            </div>

            <div class="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                 <button on:click={handleMoveToPending} 
                        class="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={$selectedPaidIDs.size === 0}>
                    &larr; Mover a Pendientes
                </button>
                <button on:click={handleSavePaidPayments} 
                        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={clientSidePaidPayments.filter(p=>!p.isSavedToDB).length === 0 && $selectedPaidIDs.size === 0}>
                    Guardar Cambios en BD
                </button>
            </div>
        </section>
    </div>
</div>
