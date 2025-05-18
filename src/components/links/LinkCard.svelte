<script lang="ts">
    import { fade } from "svelte/transition";

    import type { Link }        from "@/models/links/link.model";
    import PatternBackground    from "@/components/ui/PatternBackground.svelte";
    import GlowEffects          from "@/components/ui/GlowEffects.svelte";
    import { getBalanceIcon }   from "@/lib/balances/get-balance-icon";

    export let link: Link;
    const noImage = 'https://res.cloudinary.com/dbgzsikcs/image/upload/v1747376624/sample/3f68b623-b1d4-48a8-bd3f-6a7c3fce6397.avif'





    function formatDate(dateString: string): string {
        const options: Intl.DateTimeFormatOptions = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    }
</script>

<div
    role="article"
    class="animate-slide-up relative w-full h-full flex flex-col bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 backdrop-blur-xl rounded-xl shadow-lg border border-primary-600/30 dark:border-primary-700/50 transition-all duration-300 overflow-hidden group hover:shadow-xl hover:shadow-primary-500/20"
    aria-label="Enlace a {link.name || 'sitio web'}"
    transition:fade={{ duration: 300 }}
>
    <!-- Contenedor interno para el efecto de escala -->
    <div class="absolute inset-0 w-full h-full transition-transform duration-300 group-hover:scale-[1.02] z-0">
        <!-- Elementos decorativos de fondo que se escalan con el contenedor -->
        <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent opacity-40"></div>
        <PatternBackground patternId="linkGrid-{link.id}" />
    </div>

    <!-- Efectos de brillo que permanecen fijos -->
    <GlowEffects />

    <header class="relative z-10">
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 transition-all duration-300 group-hover:from-black/90"></div>

        <div class="w-full h-48 overflow-hidden relative">
            <img
                src     = { link.avatar || noImage }
                alt     = { link.name || 'Link image' }
                class   = "w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
            />
            <!-- Overlay para suavizar el borde de la imagen -->
            <div class="absolute inset-0 pointer-events-none shadow-[inset_0_0_10px_rgba(0,0,0,0.2)] group-hover:shadow-[inset_0_0_15px_rgba(0,0,0,0.3)] transition-all duration-300"></div>
        </div>

        <!-- Título y nombre de usuario sobre la imagen -->
        <div class="absolute bottom-0 left-0 right-0 p-4 z-20">
            <h3 class="text-lg font-bold text-white truncate flex-1 drop-shadow-md transition-all duration-300 group-hover:translate-y-[-4px]">
                {link.name || 'Mi enlace'}
            </h3>

            {#if link.account}
                <span class="text-xs bg-primary-600/40 backdrop-blur-sm text-primary-100 px-2 py-1 rounded-full mt-1 inline-block shadow-sm transition-all duration-300 group-hover:bg-primary-500/50">
                    {link.account.username}
                </span>
            {/if}
        </div>

        {#if link.isFavorite}
            <div class="absolute top-2 right-2 z-20 animate-pulse-slow">
                <div class="text-amber-300 drop-shadow-lg transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                        <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
                    </svg>
                </div>
            </div>
        {/if}

        <!-- Indicador de acción con mejor estilo y animación -->
        <div class="absolute -right-1 top-1/2 -translate-y-1/2 z-10">
            <div class="p-2 rounded-l-full bg-primary-500/50 backdrop-blur-md shadow-lg transition-all duration-300 group-hover:bg-primary-400/60 group-hover:translate-x-[-4px] group-hover:shadow-primary-400/30">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </div>
    </header>

    <main class="p-4 flex-1 flex flex-col z-10 relative">
        <!-- Línea divisoria con degradado en la parte superior -->
        <div class="h-px w-full bg-gradient-to-r from-transparent via-primary-400/30 to-transparent mb-3"></div>

        <a 
            href={link.url} 
            target="_blank" 
            rel="noopener noreferrer"
            class="flex items-center space-x-2 text-primary-300 hover:text-white text-sm mb-3 truncate transition-all duration-300 group-hover:translate-x-1"
            on:click|stopPropagation
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 flex-shrink-0 text-primary-400">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
            </svg>

            <span class="truncate">{link.url}</span>
        </a>

        <p class="text-primary-200 text-sm mb-3 line-clamp-2 transition-all duration-300 group-hover:translate-x-1">
            {link.description || 'Sin descripción'}
        </p>

        {#if link.navlyBalances && link.navlyBalances.length > 0}
            <div class="flex flex-wrap gap-2 mb-3">
                {#each link.navlyBalances as balance}
                    <div class="flex items-center bg-primary-600/40 hover:bg-primary-500/50 rounded-full px-2 py-1 backdrop-blur-sm shadow-sm transition-all duration-300 group-hover:scale-105">
                        <svelte:component this={getBalanceIcon( balance.balance.type )} class="w-4 h-4 mr-1 text-primary-100" />

                        <span class="text-xs font-medium text-primary-100">
                            {balance.balance.name}
                        </span>
                    </div>
                {/each}
            </div>
        {/if}
    </main>

    <footer class="mt-auto px-4 py-3 bg-primary-600/30 backdrop-blur-sm flex justify-between items-center border-t border-primary-500/30 z-10 relative">
        <div class="flex items-center space-x-1 text-primary-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>

            <span class="text-xs">
                {formatDate(link.updatedAt)}
            </span>
        </div>

        <div class="flex items-center space-x-1 text-primary-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z" />
            </svg>

            <span class="text-xs">{link.category}</span>
        </div>
    </footer>
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
