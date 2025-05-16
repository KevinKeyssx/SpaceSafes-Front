<script lang="ts">
    import type { Account, Navly } from "@/models/account/account.model";
    import { fade, slide } from 'svelte/transition';
    import { updateAccount, deleteAccount } from '@/stores/accountsStore';

    export let selectedAccount: Account | null = null;
    
    // Estado para modo edición
    let isEditing = false;
    let editedAccount: Account | null = null;
    let newNavlyUrl = '';
    
    // Función para generar un color de fondo basado en el nombre de usuario
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
    
    // Obtener el dominio para mostrar
    function getDomain(url: string): string {
        try {
            const domain = new URL(url).hostname;
            return domain;
        } catch (e) {
            return url;
        }
    }
    
    // Formatear fecha
    function formatDate(date: Date): string {
        return new Date(date).toLocaleString();
    }
    
    // Iniciar edición
    function startEditing(): void {
        if (!selectedAccount) return;
        
        // Crear una copia profunda del objeto para editar
        editedAccount = JSON.parse(JSON.stringify(selectedAccount));
        isEditing = true;
    }
    
    // Cancelar edición
    function cancelEditing(): void {
        isEditing = false;
        editedAccount = null;
    }
    
    // Guardar cambios
    function saveChanges(): void {
        if (!editedAccount) return;
        
        // Actualizar en el store
        updateAccount(editedAccount);
        
        // Salir del modo edición
        isEditing = false;
    }
    
    // Eliminar cuenta
    function confirmDelete(): void {
        if (!selectedAccount) return;
        
        if (confirm(`¿Estás seguro de eliminar la cuenta ${selectedAccount.username}?`)) {
            deleteAccount(String(selectedAccount.id));
            // La cuenta seleccionada se establecerá en null automáticamente en el componente padre
        }
    }
    
    // Agregar nueva URL
    function addNavlyUrl(): void {
        if (!editedAccount || !newNavlyUrl.trim()) return;
        
        editedAccount.navly = [...editedAccount.navly, { url: newNavlyUrl }];
        newNavlyUrl = '';
    }
    
    // Eliminar URL
    function removeNavlyUrl(index: number): void {
        if (!editedAccount) return;
        
        editedAccount.navly = editedAccount.navly.filter((_, i) => i !== index);
    }
    
    // Toggle favorito
    function toggleFavorite(): void {
        if (!selectedAccount) return;
        
        const updatedAccount = { 
            ...selectedAccount, 
            isFavorite: !selectedAccount.isFavorite 
        };
        
        updateAccount(updatedAccount);
    }
    
    $: gradientClass = selectedAccount ? generateGradient(selectedAccount.username) : '';

    let showPassowrd = false;
</script>

{#if !selectedAccount}
    <div 
        class="bg-white/10 dark:bg-primary-800/30 backdrop-blur-xl rounded-lg shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6"
        transition:fade={{ duration: 300 }}
    >
        <div class="flex flex-col items-center justify-center h-full min-h-[200px] text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-primary-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-gray-600 dark:text-gray-300">
                Selecciona una cuenta para ver sus detalles
            </p>
        </div>
    </div>
<!-- {:else if isEditing && editedAccount}
    <div 
        class="bg-white dark:bg-emerald-700/30 backdrop-blur-xl rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
        transition:slide={{ duration: 300 }}
    >
        <div class="bg-gradient-to-br {gradientClass} p-5 text-white">
            <h2 class="text-xl font-bold">Editar Cuenta</h2>
        </div>
        
        <form class="p-5 space-y-4" on:submit|preventDefault={saveChanges}>
            <div>
                <label for="account-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
                <input 
                    id="account-name"
                    type="text" 
                    bind:value={editedAccount.name} 
                    class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
            </div>
            
            <div>
                <label for="account-username" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                <input 
                    id="account-username"
                    type="text" 
                    bind:value={editedAccount.username} 
                    class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
            </div>
            
            <div>
                <label for="account-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contraseña</label>
                <input 
                    id="account-password"
                    type="password" 
                    bind:value={editedAccount.password} 
                    class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
            </div>
            <div>
                <label for="account-favorite" class="flex items-center">
                    <input 
                        id="account-favorite"
                        type="checkbox" 
                        bind:checked={editedAccount.isFavorite} 
                        class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Marcar como favorito</span>
                </label>
            </div>
            
            <div>
                <span class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Enlaces</span>
                {#if editedAccount.navly && editedAccount.navly.length > 0}
                    <div class="space-y-2 mb-3">
                        {#each editedAccount.navly as link, i}
                            <div class="flex items-center bg-gray-50 dark:bg-gray-700 p-2 rounded-md">
                                <span class="flex-1 truncate text-sm text-gray-700 dark:text-gray-300">{link.url}</span>
                                <button 
                                    type="button" 
                                    on:click={() => removeNavlyUrl(i)}
                                    class="ml-2 text-red-500 hover:text-red-700 dark:hover:text-red-400"
                                    aria-label="Eliminar enlace"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        {/each}
                    </div>
                {:else}
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">No hay enlaces agregados</p>
                {/if}
                <div class="flex">
                    <input 
                        id="new-url"
                        type="url" 
                        bind:value={newNavlyUrl} 
                        placeholder="https://ejemplo.com"
                        class="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-l-md text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        aria-label="Nueva URL"
                    />
                    <button 
                        type="button" 
                        on:click={addNavlyUrl}
                        class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-r-md"
                    >
                        Agregar
                    </button>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label for="account-created" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Creado</label>
                    <input 
                        id="account-created"
                        type="text" 
                        value={formatDate(editedAccount.createdAt)} 
                        disabled
                        class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 opacity-70"
                    />
                </div>
                <div>
                    <label for="account-updated" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Actualizado</label>
                    <input 
                        id="account-updated"
                        type="text" 
                        value={formatDate(editedAccount.updatedAt)} 
                        disabled
                        class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 opacity-70"
                    />
                </div>
            </div>
            <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button 
                    type="button" 
                    on:click={cancelEditing}
                    class="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md transition-colors"
                >
                    Cancelar
                </button>
                <button 
                    type="submit" 
                    class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors"
                >
                    Guardar
                </button>
            </div>
        </form>
    </div>
{:else} -->
{:else if selectedAccount}
    <div 
        class="bg-white dark:bg-primary-700/30 backdrop-blur-xl rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
        transition:fade={{ duration: 300 }}
    >
        <!-- Encabezado con gradiente -->
        <div class="relative bg-gradient-to-br {gradientClass} p-6 text-white">
            <!-- Botón de favorito -->
            <button 
                class="absolute top-4 right-4 text-white hover:scale-110 transition-transform"
                on:click={toggleFavorite}
            >
                {#if selectedAccount.isFavorite}
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-amber-300 drop-shadow-md" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                {:else}
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                {/if}
            </button>

            <div class="flex flex-col items-center">
                <!-- <div class="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div> -->

                <div class="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center mb-4 shadow-lg shadow-primary-900/20 ring-2 ring-primary-400/30 transform transition-transform duration-300 group-hover:scale-110">
                    <span class="text-white text-xl font-bold">{selectedAccount.username.charAt(0).toUpperCase()}</span>
                </div>

                <h2 class="text-2xl font-bold text-white drop-shadow-sm">
                    {selectedAccount.name || selectedAccount.username}
                </h2>
            </div>
        </div>
        
        <!-- Detalles de la cuenta -->
        <div class="p-6 space-y-3">
            <!-- Contraseña (con opción para mostrar/ocultar) -->
            <div class="grid gap-2">

                <span class="text-sm font-medium text-gray-500 dark:text-primary-400">Usuario</span>
                
                <span class="text-normal text-primary-900 dark:text-primary-100 bg-primary-50 dark:bg-primary-700/50 px-2 py-1 rounded">
                    {selectedAccount.username}
                </span>
            </div>
            <div class="grid gap-2">
                <span class="text-sm font-medium text-gray-500 dark:text-primary-400">Contraseña</span>
                <div class="flex items-center space-x-2">
                    <span class="text-normal w-full text-primary-900 dark:text-primary-100 font-mono bg-primary-50 dark:bg-primary-700/50 px-2 py-1 rounded">
                        {#if showPassowrd}
                            {selectedAccount.password}
                        {:else}
                            •••••••••••••••••••••••
                        {/if}
                    </span>
                    <button 
                        type="button" 
                        class="text-primary-600 hover:scale-110 transition-all duration-200 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                        title="Mostrar contraseña"
                        aria-label="Mostrar contraseña"
                        on:click={() => showPassowrd = !showPassowrd}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </button>
                </div>
            </div>
            
            <!-- Enlaces -->
            <div>
                <h3 class="text-sm font-medium text-primary-500 dark:text-primary-400 mb-2">Enlaces</h3>
                
                {#if selectedAccount.navly && selectedAccount.navly.length > 0}
                    <div class="flex flex-wrap gap-2">
                        {#each selectedAccount.navly as link}
                            <a 
                                href={link.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                class="inline-flex items-center px-3 py-1.5 bg-primary-100 hover:bg-primary-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full text-sm text-gray-700 dark:text-gray-300 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                {getDomain(link.url)}
                            </a>
                        {/each}
                    </div>
                {:else}
                    <p class="text-sm text-primary-500 dark:text-primary-400">No hay enlaces disponibles</p>
                {/if}
            </div>
            
            <!-- Fechas -->
            <div class="grid grid-cols-2 gap-4 pt-4 border-t border-primary-200 dark:border-gray-700">
                <div>
                    <span class="text-sm font-medium text-gray-500 dark:text-primary-400 block">Creado</span>
                    <span class="text-sm text-gray-900 dark:text-gray-100">{formatDate(selectedAccount.createdAt)}</span>
                </div>
                <div>
                    <span class="text-sm font-medium text-gray-500 dark:text-primary-400 block">Actualizado</span>
                    <span class="text-sm text-gray-900 dark:text-gray-100">{formatDate(selectedAccount.updatedAt)}</span>
                </div>
            </div>
            
            <!-- Botones de acción -->
            <div class="flex justify-between pt-4 border-t border-primary-200 dark:border-primary-700">
                <button 
                    type="button" 
                    on:click={confirmDelete}
                    class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                >
                    Eliminar
                </button>
                <button 
                    type="button" 
                    on:click={startEditing}
                    class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors"
                >
                    Editar
                </button>
            </div>
        </div>
    </div>
{/if}
