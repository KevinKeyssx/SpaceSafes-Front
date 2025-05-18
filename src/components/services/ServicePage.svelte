<script lang="ts">
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    
    // Importar componentes UI
    import Input from "@/components/ui/Inputs/Input.svelte";
    import {
        type DateValue
    }                       from "@internationalized/date";
    
    // Importar modelos
    import type { Service } from '@/models/expenses/expense.model';
    import type { Link } from '@/models/links/link.model';
    import type { PaymentService } from '@/models/payment-services/payment-service.model';
    
    // Importar stores
    import { 
        paymentServiceStore, 
        isLoadingPaymentServiceStore, 
        setPaymentServices, 
        setIsLoadingPaymentServiceStore,
        addPaymentService,
        updatePaymentService,

        deletePaymentService

    } from '@/stores/paymentServiceStore';
    
    import {
        linksStore,
        setLinks,
        setIsLoadingLinksStore
    } from '@/stores/linksStore';
    
    // Importar servicios
    import { loadSpaceSafes } from '@/services/fetch/getSpaceSafes';
    import DatePicker from '../ui/Inputs/DatePicker.svelte';
    import PaymentServiceCard from '@/components/payment-services/PaymentServiceCard.svelte';
    
    // Variables para controlar el estado
    let isLoading = false;
    let isEditing = false;
    let editingPaymentService: PaymentService | null = null;
    
    // Variables para los datos
    let availableServices: Service[] = [];
    let availableLinks: Link[] = [];
    let filteredServices: Service[] = [];
    let filteredLinks: Link[] = [];
    let filteredPaymentServices: PaymentService[] = [];
    
    // Filtrar servicios cuando cambia la consulta de búsqueda
    $: {
        if (serviceSearchQuery) {
            filteredServices = availableServices.filter(service => 
                service.name.toLowerCase().includes(serviceSearchQuery.toLowerCase()) ||
                service.description.toLowerCase().includes(serviceSearchQuery.toLowerCase())
            );
        } else {
            filteredServices = [...availableServices];
        }
    }
    
    // Filtrar links cuando cambia la consulta de búsqueda o los links disponibles
    $: {
        if (linkSearchQuery) {
            filteredLinks = availableLinks.filter(link => 
                (link.name?.toLowerCase().includes(linkSearchQuery.toLowerCase())) ||
                (link.description?.toLowerCase().includes(linkSearchQuery.toLowerCase())) ||
                (link.navlyBalances && link.navlyBalances[0]?.balance?.name?.toLowerCase().includes(linkSearchQuery.toLowerCase()))
            );
        } else {
            filteredLinks = [...availableLinks];
        }
    }
    
    // Usar links directamente de la store
    $: {
        if ($linksStore && $linksStore.length > 0) {
            // Get IDs of links already used in payment services
            const usedLinkIds = new Set($paymentServiceStore
                .filter(ps => ps.navlyId !== null && ps.navlyId !== undefined)
                .map(ps => ps.navlyId)
            );

            const allValidLinks = $linksStore.filter(link => 
                link.navlyBalances && link.navlyBalances.length > 0 && !usedLinkIds.has(link.id)
            );

            if (selectedLink) {
                let potentiallyAvailableLinks = [...allValidLinks]; 

                if (isEditing && editingPaymentService && editingPaymentService.navlyId) {
                    const currentlyEditedLinkId = editingPaymentService.navlyId;
                    const isEditingLinkInPotentiallyAvailable = potentiallyAvailableLinks.some(l => l.id === currentlyEditedLinkId);

                    if (!isEditingLinkInPotentiallyAvailable) {
                        const currentlyEditedLinkObject = $linksStore.find(l => l.id === currentlyEditedLinkId);
                        if (currentlyEditedLinkObject && currentlyEditedLinkObject.navlyBalances && currentlyEditedLinkObject.navlyBalances.length > 0) {
                            potentiallyAvailableLinks.push(currentlyEditedLinkObject);
                        }
                    }
                }
                
                // If a link is selected in the form, it should not appear in the 'availableLinks' list.
                availableLinks = potentiallyAvailableLinks.filter(link => link.id !== selectedLink!.id);

            } else {
                availableLinks = allValidLinks;
            }
        } else {
            availableLinks = [];
        }
    }

    // Filtrar PaymentServices cuando cambia la consulta de búsqueda
    $: {
        if (paymentServiceSearchQuery) {
            filteredPaymentServices = $paymentServiceStore.filter(ps => 
                ps.description?.toLowerCase().includes(paymentServiceSearchQuery.toLowerCase())
            );
        } else {
            filteredPaymentServices = [...$paymentServiceStore];
        }
    }
    
    // Variables para los filtros
    let serviceSearchQuery = '';
    let linkSearchQuery = '';
    let paymentServiceSearchQuery = '';
    
    // Variables para seleccionar elementos
    let selectedService: Service | null = null;
    let selectedLink: Link | null = null;
    
    // Variables para el formulario
    let paymentServiceForm = {
        id: '',
        userId: '',
        amount: 0,
        expirationDate: '',
        description: null as string | null,
        serviceId: '',
        navlyId: null as string | null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    

    // let openDelete = false; // This will be managed by individual cards now

    function handleEditRequest(event: CustomEvent<PaymentService>) {
        const paymentServiceToEdit = event.detail;

        if (isEditing) {
            resetForm(); 
        }

        isEditing = true; 
        editingPaymentService = paymentServiceToEdit;
        paymentServiceForm = { ...paymentServiceToEdit };
        if (typeof paymentServiceToEdit.expirationDate === 'string') {
            paymentServiceForm.expirationDate = new Date(paymentServiceToEdit.expirationDate).toISOString().split('T')[0];
        }
        
        if (paymentServiceToEdit.serviceId) {
            const serviceData = availableServices.find(s => s.id === paymentServiceToEdit.serviceId);
            if (serviceData) {
                selectService(serviceData);
            }
        }

        if (paymentServiceToEdit.navlyId && selectedService && selectedService.name === "Streaming") {
            const linkData = availableLinks.find(l => l.id === paymentServiceToEdit.navlyId);
            if (linkData) {
                selectLink(linkData);
            }
        }
    }

    
    // Cargar datos al montar el componente
    onMount(async () => {
        await loadData();
    });
    
    async function loadData() {
        isLoading = true;
        
        // Cargar servicios
        const services = await loadSpaceSafes<Service[]>({ 
            url: '/api/space-safes/services' 
        });
        
        if (services) {
            availableServices = services;
            filteredServices = [...services];
        }
        
        // Cargar links/navlys desde la API si no están en la store
        if ($linksStore.length === 0) {
            setIsLoadingLinksStore(true);
            const linkList = await loadSpaceSafes<Link[]>({ url: '/api/space-safes/navly' });
            
            if (linkList === null) {
                setIsLoadingLinksStore(false);
                return;
            }
            
            console.log('🚀 ~ file: SimpleServicePage.svelte:137 ~ linkList:', linkList)
            setLinks(linkList);
            setIsLoadingLinksStore(false);
        }
        
        // Cargar payment services
        setIsLoadingPaymentServiceStore(true);
        const paymentServices = await loadSpaceSafes<PaymentService[]>({ 
            url: '/api/space-safes/payment-services' 
        });
        if (paymentServices) {
            setPaymentServices(paymentServices);
        }
        setIsLoadingPaymentServiceStore(false);
        
        isLoading = false;
    }
    
    // Función para seleccionar un servicio
    function selectService(service: Service) {
        // Si ya hay un servicio seleccionado, devolverlo a la lista de disponibles
        if (selectedService) {
            // Devolver el servicio anterior a la lista de disponibles
            availableServices = [selectedService, ...availableServices ];
            filteredServices = [selectedService, ...filteredServices];
            
            // Si hay un link seleccionado, también lo devolvemos
            if (selectedLink) {
                removeSelectedLink();
            }
        }
        
        selectedService = {...service}; // Crear una copia para evitar referencias mutables
        paymentServiceForm.serviceId = selectedService?.id || '';
        
        // Remover el servicio seleccionado de la lista de disponibles
        availableServices = availableServices.filter(s => s.id !== selectedService?.id);
        filteredServices = filteredServices.filter(s => s.id !== selectedService?.id);
    }
    
    // Función para seleccionar un link
    function selectLink(link: Link) {
        // Solo permitir seleccionar un link si hay un servicio de tipo Streaming seleccionado
        if (!selectedService || selectedService.name !== "Streaming") return;
        
        selectedLink = {...link}; // Crear una copia para evitar referencias mutables
        const firstNavlyBalance = link.navlyBalances[0];

        paymentServiceForm.navlyId = selectedLink.id;
        paymentServiceForm.amount = firstNavlyBalance.amount;
        paymentServiceForm.description = `Suscripción de ${selectedLink.name || 'Streaming'}`;
        
        // Remover el link seleccionado de la lista de disponibles
        availableLinks = availableLinks.filter(l => l.id !== selectedLink?.id);
        // filteredLinks will update reactively
    }
    
    // Función para eliminar el servicio seleccionado
    function removeSelectedService() {
        if (selectedService) {
            // Devolver el servicio a la lista de disponibles
            availableServices = [...availableServices, selectedService];
            filteredServices = [...filteredServices, selectedService];
            
            // Limpiar la selección
            selectedService = null;
            paymentServiceForm.serviceId = '';
            
            // Si hay un link seleccionado, también lo devolvemos
            if (selectedLink) {
                removeSelectedLink();
            }
        }
    }
    
    // Función para eliminar el link seleccionado
    function removeSelectedLink() {
        if (selectedLink) {
            // Devolver el link a la lista de disponibles
            // availableLinks will be repopulated reactively from $linksStore when selectedLink becomes null
            
            // Limpiar la selección
            selectedLink = null;
            paymentServiceForm.navlyId = null;
            paymentServiceForm.amount = 0;
            paymentServiceForm.description = '';
        }
    }
    
    // Función para guardar el payment service
    async function savePaymentService() {
        if (!selectedService) {
            return;
        }

        const dateValue = paymentServiceForm.expirationDate as unknown as DateValue;
        const expirationDate = new Date( dateValue.year, dateValue.month - 1, dateValue.day ).toISOString().split('T')[0];
        
        // Crear un objeto que cumpla con el tipo PaymentService
        const newPaymentService = {
            amount: paymentServiceForm.amount,
            expirationDate,
            description: paymentServiceForm.description,
            serviceId: paymentServiceForm.serviceId,
            navlyId: paymentServiceForm.navlyId
        } as PaymentService;

        console.log('🚀 ~ file: SimpleServicePage.svelte:231 ~ newPaymentService:', newPaymentService)

        
        if (isEditing && editingPaymentService) {
            const resul = await loadSpaceSafes<PaymentService>({
                url: `/api/space-safes/payment-services/${editingPaymentService.id}`,
                method: 'PATCH',
                data: newPaymentService
            });
            console.log('🚀 ~ file: SimpleServicePage.svelte:250 ~ resul:', resul)

            if ( !resul ) {
                return
            }
            updatePaymentService(resul);
        } else {
            // Crear nuevo
            const savedPaymentService = await loadSpaceSafes<PaymentService>({
                url: '/api/space-safes/payment-services',
                method: 'POST',
                data: newPaymentService
            });
            
            console.log('🚀 ~ file: SimpleServicePage.svelte:258 ~ savedPaymentService:', savedPaymentService)
            if (savedPaymentService) {
                addPaymentService(savedPaymentService);
            }
        }
        
        // Limpiar el formulario
        resetForm();
    }
    
    // Función para resetear el formulario
    function resetForm() {
        paymentServiceForm = {
            id: '',
            userId: '',
            amount: 0,
            expirationDate:'',
            description: null,
            serviceId: '',
            navlyId: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // Devolver los elementos seleccionados a sus listas
        if (selectedService) {
            removeSelectedService();
        }
        
        if (selectedLink) {
            removeSelectedLink();
        }
        
        isEditing = false;
        editingPaymentService = null;
    }
    
    // Función para formatear fechas
    function formatDate(dateString: string | Date): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }
</script>

<div class="container mx-auto px-4 py-6">
    <h1 class="text-2xl font-bold mb-6 text-primary-600 dark:text-primary-400">Gestión de Servicios de Pago</h1>
    
    <!-- Loader -->
    {#if isLoading || $isLoadingPaymentServiceStore}
        <div class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            <span class="ml-3 text-lg text-primary-600">Cargando...</span>
        </div>
    {:else}
        <!-- Contenido principal -->
        <div class="mb-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Columna izquierda: Servicios disponibles -->
                <div class="bg-white dark:bg-primary-800 rounded-lg shadow-md p-4 border border-primary-200 dark:border-primary-700">
                    <h2 class="text-lg font-semibold mb-4 text-primary-900 dark:text-white">Servicios Disponibles</h2>

                    <!-- Buscador de servicios -->
                    <Input
                        label="Buscar servicios"
                        id="serviceSearch"
                        type="text"
                        placeholder="Nombre o descripción"
                        bind:value={serviceSearchQuery}
                    />

                    <!-- Lista de servicios -->
                    <div class="h-96 overflow-y-auto pr-2 mt-4">
                        {#each filteredServices as service (service.id)}
                            <div 
                                class="bg-primary-50 dark:bg-primary-700 p-3 mb-2 rounded-lg hover:shadow-md transition-shadow flex justify-between items-center"
                                transition:fade={{ duration: 150 }}
                            >
                                <div>
                                    <h3 class="font-medium text-primary-900 dark:text-white">{service.name}</h3>
                                    <p class="text-sm text-primary-500 dark:text-primary-400">{service.description}</p>
                                </div>
                                <button 
                                    class="bg-primary-600 hover:bg-primary-700 text-white rounded-full p-1.5 flex items-center justify-center transition-colors"
                                    on:click={() => selectService(service)}
                                    title="Seleccionar servicio"
                                    aria-label="Seleccionar servicio"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                            {:else}
                                <div class="text-center py-8 text-primary-500 dark:text-primary-400">
                                    No hay servicios disponibles
                                </div>
                        {/each}
                    </div>
                </div>

                <!-- Columna central: Payment Service en edición -->
                <div class="bg-white dark:bg-primary-800 rounded-lg shadow-md p-4 border border-primary-200 dark:border-primary-700">
                    <h2 class="text-lg font-semibold mb-4 text-primary-900 dark:text-white">
                        {isEditing ? 'Editar Servicio de Pago' : 'Nuevo Servicio de Pago'}
                    </h2>

                    <form on:submit|preventDefault={savePaymentService} class="space-y-4">
                        <!-- Área para mostrar el servicio seleccionado -->
                        <div class="mb-4">
                            <label for="service" class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">
                                Servicio
                            </label>

                            {#if selectedService}
                                <div class="bg-primary-50 dark:bg-primary-900 p-3 rounded-lg border border-primary-200 dark:border-primary-700 relative">
                                    <button 
                                        type="button"
                                        class="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                        on:click={removeSelectedService}
                                        aria-label="Eliminar servicio"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                                        </svg>
                                    </button>
                                    <h3 class="font-medium text-primary-700 dark:text-primary-300">{selectedService.name}</h3>
                                    <p class="text-sm text-primary-600 dark:text-primary-400">{selectedService.description}</p>
                                </div>
                            {:else}
                                <div class="h-24 border-2 border-dashed border-primary-300 dark:border-primary-600 rounded-lg flex items-center justify-center text-primary-500 dark:text-primary-400">
                                    Selecciona un servicio usando el botón de flecha
                                </div>
                            {/if}
                        </div>

                        <!-- Campos del formulario -->
                        <div class="space-y-3">
                            <div class="space-y-1">
                                <Input
                                    label="Monto"
                                    type="number"
                                    placeholder="0.00"
                                    bind:value={paymentServiceForm.amount}
                                    disabled={!!selectedLink}
                                    required
                                />
                            </div>

                            <DatePicker
                                id="expirationDate"
                                bind:value={paymentServiceForm.expirationDate}
                                label="Fecha de expiración"
                            />

                            <Input
                                label="Descripción"
                                placeholder="Descripción del pago"
                                type="text"
                                bind:value={paymentServiceForm.description as string}
                                disabled={!!selectedLink}
                                required
                            />
                        </div>

                        <!-- Área para mostrar el link seleccionado -->
                        <div class="mb-4">
                            <label for="link" class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">
                                Link (opcional)
                            </label>
                            
                            {#if selectedLink}
                                <div class="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg border border-blue-200 dark:border-blue-700 relative">
                                    <button 
                                        type="button"
                                        class="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                        on:click={removeSelectedLink}
                                        aria-label="Eliminar link"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                                        </svg>
                                    </button>
                                    <h3 class="font-medium text-blue-700 dark:text-blue-300">{selectedLink.name || selectedLink.description || 'Link sin nombre'}</h3>
                                    <p class="text-sm text-blue-600 dark:text-blue-400">Monto: ${selectedLink.navlyBalances && selectedLink.navlyBalances[0] ? selectedLink.navlyBalances[0].amount.toFixed(2) : 'N/A'}</p>
                                </div>
                            {:else if selectedService && selectedService.name === "Streaming"}
                                <div class="h-24 border-2 border-dashed border-primary-300 dark:border-primary-600 rounded-lg flex items-center justify-center text-primary-500 dark:text-primary-400">
                                    Selecciona un link usando el botón de flecha
                                </div>
                            {:else}
                                <div class="h-24 border-2 border-dashed border-primary-300 dark:border-primary-600 rounded-lg flex items-center justify-center text-primary-400 dark:text-primary-500 bg-primary-100 dark:bg-primary-700 opacity-50">
                                    {selectedService ? 'Solo disponible para servicios de Streaming' : 'Primero selecciona un servicio'}
                                </div>
                            {/if}
                        </div>
                        
                        <!-- Botones de acción -->
                        <div class="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                class="px-4 py-2 bg-primary-200 hover:bg-primary-300 text-primary-800 rounded-lg transition-colors"
                                on:click={resetForm}
                            >
                                Cancelar
                            </button>
                            
                            <button
                                type="submit"
                                class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                                disabled={!selectedService}
                            >
                                {isEditing ? 'Actualizar' : 'Guardar'}
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Columna derecha: Enlaces disponibles -->
                <div class="bg-white dark:bg-primary-800 rounded-lg shadow-md p-4 border border-primary-200 dark:border-primary-700">

                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-lg font-semibold text-primary-900 dark:text-white">Enlaces Disponibles ({filteredLinks.length})</h2>

                        <p class="text-primary-500 dark:text-primary-400">
                            ({filteredLinks.length})
                        </p>
                    </div>
                    <!-- Buscador de links -->
                    <div class="mb-4">
                        <div class="space-y-1">
                            <Input
                                label="Buscar Enlaces"
                                id="linkSearch"
                                type="text"
                                placeholder="Nombre"
                                bind:value={linkSearchQuery}
                            />
                        </div>
                    </div>
                    
                    <!-- Lista de links -->
                    <div 
                        class="h-96 overflow-y-auto"
                        class:opacity-50={!selectedService || selectedService.name !== "Streaming"}
                        class:pointer-events-none={!selectedService || selectedService.name !== "Streaming"}
                    >
                        {#if filteredLinks.length === 0}
                            <div class="text-center py-8 text-primary-500 dark:text-primary-400">
                                No hay links disponibles
                            </div>
                        {:else}
                            {#each filteredLinks as link (link.id)}
                                <div 
                                    class="bg-primary-50 dark:bg-primary-700 p-3 mb-2 rounded-lg hover:shadow-md transition-shadow flex justify-between items-center"
                                    transition:fade={{ duration: 150 }}
                                >
                                    <div>
                                        <h3 class="font-medium text-primary-900 dark:text-white">{link.name || link.description || 'Link sin nombre'}</h3>
                                        <p class="text-sm text-primary-500 dark:text-primary-400">Monto: ${link.navlyBalances && link.navlyBalances[0] ? link.navlyBalances[0].amount.toFixed(2) : 'N/A'}</p>
                                        {#if link.navlyBalances && link.navlyBalances[0]?.expirationDate}
                                            <p class="text-xs text-primary-500 dark:text-primary-400">Expira: {formatDate(link.navlyBalances[0].expirationDate)}</p>
                                        {/if}
                                    </div>
                                    <button 
                                        class="bg-primary-600 hover:bg-primary-700 text-white rounded-full p-1.5 flex items-center justify-center transition-colors"
                                        on:click={() => selectLink(link)}
                                        title="Seleccionar enlace"
                                        aria-label="Seleccionar enlace"
                                        disabled={!selectedService || selectedService.name !== "Streaming"}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            {/each}
                        {/if}
                    </div>
                </div>
            </div>




            <!-- Lista de Payment Services existentes -->
            <div class="mt-8">
                <h2 class="text-xl font-semibold mb-4 text-primary-900 dark:text-white">Servicios de Pago Existentes</h2>

                    <Input 
                        type="text" 
                        placeholder="Buscar por descripción..." 
                        bind:value={paymentServiceSearchQuery} 
                        id="paymentServiceSearch"
                    />
                
                {#if filteredPaymentServices.length === 0}
                    <div class="text-center py-12 bg-primary-50 dark:bg-primary-800 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-primary-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        <h3 class="text-lg font-medium text-primary-500 dark:text-primary-400">
                            {#if paymentServiceSearchQuery}
                                No se encontraron servicios de pago que coincidan con "{paymentServiceSearchQuery}"
                            {:else}
                                No hay servicios de pago registrados
                            {/if}
                        </h3>
                        <p class="text-primary-500 dark:text-primary-400 mt-2">
                            {#if !paymentServiceSearchQuery && $paymentServiceStore.length === 0}
                                Comienza agregando un nuevo servicio de pago
                            {/if}
                        </p>
                    </div>
                {:else}
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                        {#each filteredPaymentServices as paymentService (paymentService.id)}
                            <PaymentServiceCard
                                {paymentService}
                                formatDateFn={formatDate}
                                onEdit={(service) => handleEditRequest({ detail: service } as CustomEvent<PaymentService>)}
                            />
                        {/each}
                    </div>
                {/if}
            </div>
        </div>
    {/if}
</div>
