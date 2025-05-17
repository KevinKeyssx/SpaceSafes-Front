<script lang="ts">
    import type { Account } from "@/models/account/account.model";
    import { fade } from 'svelte/transition';
    import PatternBackground from "../ui/PatternBackground.svelte";

    export let account: Account;
    export let selectedAccountId: string | null = null;

    export let handleAccountClick: (account: Account) => void = () => {};
    
    // Obtener el dominio para mostrar
    function getDomain(url: string): string {
        try {
            const domain = new URL(url).hostname;
            return domain;
        } catch (e) {
            return url;
        }
    }

    $: displayName = account.name || account.username;
</script>

<div
    role="article"
    class="account-card w-full mb-4"
    transition:fade={{ duration: 300 }}
>
    <button
        on:click={() => handleAccountClick(account)}
        class="w-full relative overflow-hidden border-0 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 flex flex-col p-6 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-2xl group animate-slide-up backdrop-blur-lg {
            selectedAccountId === account.id
            ? 'ring-2 ring-primary-300 shadow-lg shadow-primary-500/20'
            : 'hover:scale-[1.01] hover:shadow-xl hover:shadow-primary-500/10'
        }"
    >
        <!-- Elementos decorativos de fondo -->
        <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent opacity-40"></div>
        <div class="absolute -top-10 -left-10 w-40 h-40 bg-primary-600/20 rounded-full blur-2xl"></div>
        <div class="absolute -bottom-12 -right-12 w-40 h-40 bg-primary-500/20 rounded-full blur-2xl"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary-400/5 rounded-full blur-xl opacity-70"></div>

        <PatternBackground />

        <!-- Indicador de favorito con animación -->        
        {#if account.isFavorite}
            <div class="absolute top-3 right-3 z-10 animate-pulse-slow">
                <div class="text-amber-300 drop-shadow-lg transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                </div>
            </div>
        {/if}

        <!-- Contenido principal con mejor organización -->
        <div class="relative z-10 flex flex-col justify-center w-full">
            <!-- Avatar/Inicial del usuario -->
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center mb-4 shadow-lg shadow-primary-900/20 ring-2 ring-primary-400/30 transform transition-transform duration-300 group-hover:scale-110">
                <span class="text-white text-xl font-bold">{account.username?.charAt(0).toUpperCase()}</span>
            </div>
            
            <!-- Información del usuario -->
            <div class="mb-3">
                <h3 class="text-xl font-bold text-white drop-shadow-sm truncate transition-all duration-300 group-hover:translate-x-1">
                    {account.username}
                </h3>

                <p class="text-sm text-primary-200 truncate transition-all duration-300 group-hover:translate-x-1">
                    {displayName}
                </p>
            </div>

            <!-- Línea divisoria con degradado -->
            <div class="h-px w-full bg-gradient-to-r from-transparent via-primary-400/30 to-transparent my-3"></div>

            <!-- Enlaces con mejor estilo -->
            <div class="mt-2 flex flex-wrap gap-2">
                {#each account.navly as link, i}
                    <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        class="inline-flex items-center px-3 py-1.5 bg-primary-600/40 hover:bg-primary-500/50 rounded-full text-sm text-white transition-all duration-300 group-hover:scale-105 backdrop-blur-sm shadow-sm"
                        on:click|stopPropagation
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span class="text-primary-100">{getDomain(link.url)}</span>
                    </a>
                {:else}
                    <p class="inline-flex items-center px-3 py-1.5 bg-primary-600/40 rounded-full text-sm text-primary-200 backdrop-blur-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        Sin enlaces
                    </p>
                {/each}
            </div>
        </div>

        <!-- Indicador de acción con mejor estilo y animación -->
        <div class="absolute bottom-3 right-3 z-10">
            <div class="p-2 rounded-full bg-primary-500/30 backdrop-blur-md shadow-lg transition-all duration-300 group-hover:bg-primary-400/40 group-hover:translate-x-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </div>
        
        <!-- Indicador de selección -->
        {#if selectedAccountId === account.id}
            <div class="absolute top-0 left-0 w-1 h-full bg-primary-300"></div>
        {/if}
    </button>
</div>

<style>
    .account-card {
        container-type: inline-size;
    }
    
    @container (max-width: 350px) {
        .account-card button {
            padding: 1rem;
        }
    }
    
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