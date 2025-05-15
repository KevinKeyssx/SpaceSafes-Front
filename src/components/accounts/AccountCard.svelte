<script lang="ts">
    import type { Account } from "@/models/account/account.model";
    import { fade } from 'svelte/transition';

    export let account: Account;
    export let selectedAccountId: number | null = null;

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
    
    // Generar un color de fondo basado en el nombre de usuario
    function generateGradient(username: string): string {
        const colors = [
            'from-blue-500 to-purple-600',
            'from-emerald-500 to-teal-600',
            'from-orange-500 to-amber-600',
            'from-pink-500 to-rose-600',
            'from-indigo-500 to-violet-600',
            'from-cyan-500 to-blue-600',
            'from-fuchsia-500 to-purple-600'
        ];
        
        const index = username.charCodeAt(0) % colors.length;
        return colors[index];
    }
    
    $: gradientClass = generateGradient(account.username);
    $: displayName = account.name || account.username;
</script>

<div 
    class="account-card w-full mb-4"
    transition:fade={{ duration: 300 }}
>
    <button
        on:click={() => handleAccountClick(account)}
        class="w-full relative overflow-hidden border-0 bg-gradient-to-br {gradientClass} flex flex-col p-5 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-xl group animate-slide-up backdrop-blur-lg {
            selectedAccountId === account.id
            ? 'ring-2 ring-white shadow-lg scale-[1.02]'
            : 'hover:scale-[1.01] hover:shadow-lg'
        }"
    >
        <!-- Fondo decorativo -->
        <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent opacity-30"></div>
        <div class="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        
        <!-- Indicador de favorito -->
        {#if account.isFavorite}
            <div class="absolute top-3 right-3 z-10">
                <div class="text-amber-300 drop-shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                </div>
            </div>
        {/if}

        <div class="relative z-10 flex flex-col text-white">
            <div class="mb-2">
                <h3 class="text-xl font-bold text-white drop-shadow-sm truncate transition-all duration-300 group-hover:translate-x-1">
                    {account.username}
                </h3>

                <p class="text-sm text-white/80 truncate transition-all duration-300 group-hover:translate-x-1">
                    {displayName}
                </p>
            </div>

            <div class="mt-2 flex flex-wrap gap-2">
                {#each account.navly as link, i}
                    <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        class="inline-flex items-center px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-full text-sm text-white transition-all duration-300 group-hover:scale-105"
                        on:click|stopPropagation
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        {getDomain(link.url)}
                    </a>
                {:else}
                    <p class="inline-flex items-center px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-full text-sm text-white transition-all duration-300 group-hover:scale-105">
                        Sin enlaces
                    </p>
                {/each}
            </div>
        </div>

        <div class="absolute bottom-3 right-3 z-10">
            <div class="p-2 rounded-full bg-white/20 transition-all duration-300 group-hover:bg-white/30">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </div>
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
</style>