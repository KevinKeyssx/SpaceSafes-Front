<script lang="ts">
    import { fade } from "svelte/transition";

    import PatternBackground    from "@/components/ui/PatternBackground.svelte";
    import GlowEffects          from "@/components/ui/GlowEffects.svelte";

    import type { Balance } from "@/models/balance/balance.model";
    import { TypeBalance }  from "@/models/balance/enum/type-balance.enum";

    import { getCategoryName }  from "@/lib/balances/get-category-name";
    import { getCategoryColor } from "@/lib/balances/get-category-color";
    import { getBalanceIcon }   from "@/lib/balances/get-balance-icon";


    export let balance: Balance;


    function formatCurrency( amount: number ): string {
        return new Intl.NumberFormat('es-ES', {
            style                   : 'currency',
            currency                : 'EUR',
            minimumFractionDigits   : 2
        }).format( amount );
    }
</script>

<div
    transition:fade={{ duration: 300 }}
    class="animate-slide-up relative w-full text-left bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 backdrop-blur-xl rounded-xl shadow-lg border border-primary-600/30 dark:border-primary-700/50 overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-primary-500/20 group"
>
<!-- Contenedor interno para el efecto de escala -->
    <PatternBackground patternId="balanceGrid-{balance.id}" />

    <!-- Efectos de brillo que permanecen fijos -->
    <GlowEffects />

    <header class="relative h-24 bg-gradient-to-r {getCategoryColor(balance.type)} flex items-center justify-between px-6 z-10">
        <div class="text-white transition-all duration-300 group-hover:translate-y-[-2px]">
            <h3 class="text-xl font-bold drop-shadow-md">{balance.name}</h3>

            <p class="text-white/80 text-sm">{getCategoryName(balance.type)}</p>
        </div>

        <div class="bg-white/20 p-3 rounded-full shadow-md transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30">
            <svelte:component this={getBalanceIcon( balance.type )} class="w-6 h-6 text-primary-100" />
        </div>
        <!-- Overlay para suavizar el borde -->
        <div class="absolute inset-0 pointer-events-none shadow-[inset_0_0_10px_rgba(0,0,0,0.2)] group-hover:shadow-[inset_0_0_15px_rgba(0,0,0,0.3)] transition-all duration-300"></div>
    </header>
    <!-- Indicador de acción con mejor estilo y animación -->

    <main class="p-5 z-10 relative">
        <!-- Línea divisoria con degradado en la parte superior -->
        <div class="h-px w-full bg-gradient-to-r from-transparent via-primary-400/30 to-transparent mb-3"></div>
        <div class="flex justify-between items-center mb-3">
            <div class="text-primary-200 text-sm transition-all duration-300 group-hover:translate-x-1">Saldo disponible</div>
            <div class="text-2xl font-bold text-white drop-shadow-sm transition-all duration-300 group-hover:translate-y-[-2px]">{formatCurrency(balance.balance)}</div>
        </div>

        {#if balance.type === TypeBalance.BANK_ACCOUNT && balance.accountNumber}
            <div class="flex items-center text-primary-300 text-sm mb-3 transition-all duration-300 group-hover:translate-x-1">
                <span class="mr-2 text-primary-400">IBAN:</span>
                <span class="font-mono">{balance.accountNumber}</span>
            </div>
        {/if}

        {#if balance.cardNumber}
        <div class="flex items-center text-primary-300 text-sm mb-3 transition-all duration-300 group-hover:translate-x-1">
            <span class="mr-2 text-primary-400">{balance.typeCard}</span>

            <div class="font-mono items-center flex">
                <span class="mt-1.5 mr-2">**** **** ****</span>
                <span>{balance.cardNumber.slice(-4)}</span>
            </div>
        </div>
        {/if}

        <footer class="mt-auto flex justify-between items-center text-xs text-primary-300 bg-primary-600/30 backdrop-blur-sm p-3 -mx-5 -mb-5 border-t border-primary-500/30 z-10 relative">
            <div>
                {#if balance.lastPayment}
                    <div class="flex items-center transition-all duration-300 group-hover:translate-y-[-1px]">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Utilizada: {new Date(balance.lastPayment).toLocaleDateString('es-ES')}</span>
                    </div>
                {/if}
            </div>

            {#if balance.bankName}
                <div class="flex items-center transition-all duration-300 group-hover:translate-y-[-1px]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                <span>{balance.bankName}</span>
                </div>
            {/if}
        </footer>
    </main>
</div>

<style>
    @keyframes pulse-slow {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.8;
        }
    }

    .animate-pulse-slow {
        animation: pulse-slow 3s ease-in-out infinite;
    }
</style>
