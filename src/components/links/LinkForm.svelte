
<script lang="ts">
    import { slide }    from 'svelte/transition';
    import { onMount }  from 'svelte';

    import toast from 'svelte-french-toast';

    import { errorToast, successToast } from '@/config/toast/toast.config';

    import { 
        balanceStore, 
        isLoadingBalanceStore, 
        setIsLoadingBalanceStore, 
        setBalances 
    }                               from '@/stores/balanceStore';
    import { addLink, updateLink }  from '@/stores/linksStore';

    import Switch           from "@/components/ui/Inputs/Switch.svelte";
    import Input            from "@/components/ui/Inputs/Input.svelte";
    import OutlineButton    from '@/components/ui/Buttons/OutlineButton.svelte';
    import Combobox         from '@/components/ui/Inputs/Combobox.svelte';

    import { WebsiteCategory }      from '@/models/links/enum/web-category.enum';
    import type { Link, LinkSave }  from '@/models/links/link.model';
    import type { Balance }         from '@/models/balance/balance.model';

    import { loadSpaceSafes } from '@/services/fetch/getSpaceSafes';
    import SaveButton from '../ui/Buttons/SaveButton.svelte';


    export let link : LinkSave = {} as LinkSave;
    export let open : boolean;


    let isLoadingSave = false;
    let disabledName        = true;
    let disabledDescription = true;
    let navlyContainer      : HTMLDivElement;
    let isLoadingBalances   = false;
    let linkEdit            = { 
        ...link,
        category    : link.category     || "",
        isFavorite  : link.isFavorite   || false
    };


    const oldUrl = link.url;


    if ( !link.id || link.balanceIds.length === 0 ) {
        linkEdit.balanceIds = [];
    }

    // Cargar los balances si no están ya cargados
    onMount(async () => {
        if ( $balanceStore.length === 0 ) {
            isLoadingBalances = true;

            setIsLoadingBalanceStore( true );

            const balanceList = await loadSpaceSafes<Balance[]>({ url: '/api/space-safes/balances' });

            if ( balanceList !== null ) {
                setBalances( balanceList );
            }

            setIsLoadingBalanceStore( false );
            isLoadingBalances = false;
        }

    console.log('🚀 ~ file: LinkForm.svelte:80 ~ linkEdit.balanceIds:', linkEdit.balanceIds)

    });

    // Filtrar los balances que ya están seleccionados
    $: availableBalances = $balanceStore.filter(balance => 
        !linkEdit.balanceIds.includes(balance.id)
    );

    // Crear opciones para el combobox
    $: balanceOptions = availableBalances.map(balance => ({
        value: balance.id,
        label: balance.name
    }));


    function addBalanceId(): void {
        linkEdit.balanceIds = [...linkEdit.balanceIds, ''];
    }


    function removeBalanceId( index: number ): void {
        linkEdit.balanceIds = [...linkEdit.balanceIds.filter(( _, i ) => i !== index )];
    }


    async function createLink(): Promise<void> {
        console.log('🚀 ~ file: LinkForm.svelte:53 ~ linkEdit:', linkEdit)
        const savedLink = await loadSpaceSafes<Link>({
            url     : `/api/space-safes/navly`,
            method  : 'POST',
            data    : linkEdit
        });

        console.log('🚀 ~ file: LinkForm.svelte:56 ~ savedLink:', savedLink)

        if ( !savedLink ) {
            isLoadingSave = false;
            toast.error( 'Ocurrió un error al guardar el enlace', errorToast() );
            return;
        }

        addLink( savedLink );
        open = false;
        isLoadingSave = false;
        toast.success( 'Enlace guardado correctamente', successToast() );
    }


    async function updatedLink() {
        const {
            url,
            avatar,
            // balanceIds,
            id,
            ...rest
        } = linkEdit;

        const updatedLinkEdit = {
            ...rest,
            ...( oldUrl !== linkEdit.url && { url }),
        };
        console.log('🚀 ~ file: LinkForm.svelte:120 ~ updatedLinkEdit:', updatedLinkEdit)

        const savedLink = await loadSpaceSafes<Link>({
            url     : `/api/space-safes/navly/${linkEdit.id}`,
            method  : 'PATCH',
            data    : updatedLinkEdit
        });
        
        console.log('🚀 ~ file: LinkForm.svelte:126 ~ savedLink:', savedLink)
        if ( !savedLink ) {
            isLoadingSave = false;
            toast.error( 'Ocurrió un error al guardar el enlace', errorToast() );
            return;
        }

        updateLink( savedLink );
        open = false;
        isLoadingSave = false;
        toast.success( 'Enlace actualizado correctamente', successToast() );
    }


    async function saveLink(): Promise<void> {
        isLoadingSave = true;
        linkEdit.balanceIds = linkEdit.balanceIds.filter( id => id.trim() !== '' );

        if ( !linkEdit.id ) {
            createLink();
            return;
        }

        updatedLink();
    }

</script>

<form
    class="p-5" on:submit|preventDefault={saveLink}
    transition:slide={{ duration: 300 }}
>
    <div class="space-y-2">
        <Input
            label="URL"
            id="url"
            type="text" 
            placeholder="https://www.google.com"
            bind:value={linkEdit.url}
        />

        <Combobox
            label="Categoría"
            id="category"
            name="category"
            placeholder="Seleccionar categoría"
            bind:value={linkEdit.category}
            options={[
                { value: WebsiteCategory.SOCIAL_MEDIA, label: "Redes Sociales" },
                { value: WebsiteCategory.E_COMMERCE, label: "Compras" },
                { value: WebsiteCategory.FINANCE, label: "Finanzas" },
                { value: WebsiteCategory.EDUCATION, label: "Educación" },
                { value: WebsiteCategory.ENTERTAINMENT, label: "Entretenimiento" },
                { value: WebsiteCategory.PRODUCTIVITY, label: "Productividad" },
                { value: WebsiteCategory.DEVELOPMENT, label: "Desarrollo" },
                { value: WebsiteCategory.STREAMING, label: "Streaming" },
                { value: WebsiteCategory.GAMING, label: "Juegos" },
                { value: WebsiteCategory.NEWS, label: "Noticias" },
                { value: WebsiteCategory.HEALTH, label: "Salud" },
                { value: WebsiteCategory.DESIGN, label: "Diseño" },
                { value: WebsiteCategory.MUSIC, label: "Música" },
                { value: WebsiteCategory.VIDEO, label: "Video" },
                { value: WebsiteCategory.CLOUD_STORAGE, label: "Almacenamiento" },
                { value: WebsiteCategory.EMAIL, label: "Correo" },
                { value: WebsiteCategory.FORUM, label: "Foros" },
                { value: WebsiteCategory.BLOG, label: "Blogs" },
                { value: WebsiteCategory.TRAVEL, label: "Viajes" },
                { value: WebsiteCategory.FOOD, label: "Comida" },
                { value: WebsiteCategory.SPORTS, label: "Deportes" },
                { value: WebsiteCategory.TECHNOLOGY, label: "Tecnología" },
                { value: WebsiteCategory.BUSINESS, label: "Negocios" },
                { value: WebsiteCategory.MARKETING, label: "Marketing" },
                { value: WebsiteCategory.SCIENCE, label: "Ciencia" },
                { value: WebsiteCategory.GOVERNMENT, label: "Gobierno" },
                { value: WebsiteCategory.NONPROFIT, label: "Sin fines de lucro" },
                { value: WebsiteCategory.DOCUMENTATION, label: "Documentación" },
                { value: WebsiteCategory.PERSONAL, label: "Personal" },
                { value: WebsiteCategory.OTHER, label: "Otros" }
            ]}
        />

        <div class="flex gap-2 items-end">
            <Input
                label="Nombre del enlace"
                id="name"
                type="text" 
                placeholder="Se puede generar automaticamente"
                disabled={disabledName}
                bind:value={linkEdit.name}
            />

            <OutlineButton
                onClick={() => disabledName = !disabledName}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="20" stroke-dashoffset="20" d="M3 21h18"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.2s" values="20;0"/></path><path stroke-dasharray="48" stroke-dashoffset="48" d="M7 17v-4l10 -10l4 4l-10 10h-4"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.2s" dur="0.6s" values="48;0"/></path><path stroke-dasharray="8" stroke-dashoffset="8" d="M14 6l4 4"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.2s" values="8;0"/></path></g></svg>
            </OutlineButton>
        </div>

        <div class="flex gap-2 items-end">
            <Input
                label="Descripción"
                id="description"
                type="text" 
                placeholder="Se puede generar automaticamente"
                disabled={disabledDescription}
                bind:value={linkEdit.description}
            />

            <OutlineButton
                onClick={() => disabledDescription = !disabledDescription}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="20" stroke-dashoffset="20" d="M3 21h18"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.2s" values="20;0"/></path><path stroke-dasharray="48" stroke-dashoffset="48" d="M7 17v-4l10 -10l4 4l-10 10h-4"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.2s" dur="0.6s" values="48;0"/></path><path stroke-dasharray="8" stroke-dashoffset="8" d="M14 6l4 4"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.2s" values="8;0"/></path></g></svg>
            </OutlineButton>
        </div>

        <Switch
            label="Marcar como favorito"
            id="isFavorite"
            bind:checked={linkEdit.isFavorite}
        />

        <span class="text-sm font-medium text-primary-700 dark:text-primary-200 mb-1">Balances</span>

        {#if isLoadingBalances || $isLoadingBalanceStore}
            <div class="flex justify-center items-center py-4">
                <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
                <span class="ml-2 text-primary-600">Cargando balances...</span>
            </div>
        {:else if $balanceStore.length === 0}
            <div class="text-center py-4 text-gray-500">
                No hay balances disponibles. Por favor, crea un balance primero.
            </div>
        {:else}
            <div bind:this={navlyContainer} class="flex flex-col gap-2">
                {#each linkEdit.balanceIds as balanceId, index}
                    <div
                        class="flex gap-2 w-full"
                        transition:slide={{ duration: 300 }}
                    >
                        {#if balanceId}
                            <!-- Balance ya seleccionado -->
                            {#if $balanceStore.find( b => b.id === balanceId )}
                                <div class="flex-1 border-none py-2 px-4 ring-1 ring-primary-400 hover:ring-primary-500 focus:ring-2 rounded-lg bg-primary-50/50 dark:bg-primary-800/50 items-center text-primary-300">
                                    {#if index === 0}
                                        <span class="text-[11px] rounded-lg py-1 px-2 bg-primary-600/50 text-primary-50">
                                            Principal
                                        </span>
                                    {/if}

                                    {$balanceStore.find( b => b.id === balanceId )?.name || 'Balance no encontrado'}
                                </div>
                            {:else}
                                <div class="flex-1 border-none py-2 px-4 ring-1 ring-primary-400 hover:ring-primary-500 focus:ring-2 rounded-lg bg-primary-50/50 dark:bg-primary-800/50 items-center text-red-800">
                                    Balance no encontrado
                                </div>
                            {/if}
                        {:else}
                            <!-- Selector de balance -->
                            <div class="flex-1">
                                <Combobox
                                    id={`balanceid-${index}`}
                                    name={`balanceid-${index}`}
                                    placeholder="Seleccionar balance"
                                    bind:value={linkEdit.balanceIds[index]}
                                    options={balanceOptions}
                                />
                            </div>
                        {/if}

                        <OutlineButton
                            onClick={() => removeBalanceId(index)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-dasharray="16" stroke-dashoffset="16" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="16;0"/></path></svg>
                        </OutlineButton>
                    </div>
                {/each}
            </div>

            <button
                type="button"
                on:click={addBalanceId}
                disabled={linkEdit.balanceIds.length >= 5 || availableBalances.length === 0}
                class="disabled:opacity-50 w-full mt-1 mx-auto rounded-lg text-center justify-center items-center px-4 py-1 ring-2 ring-primary-500 hover:bg-primary-700 text-white transition-colors flex"
                aria-label="Agregar balance"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="mr-1"><g fill="none" stroke="currentColor" stroke-dasharray="16" stroke-dashoffset="16" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M5 12h14"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="16;0"/></path><path d="M12 5v14"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.4s" values="16;0"/></path></g></svg>
                Agregar balance
            </button>

            {#if linkEdit.balanceIds.length > 0 && linkEdit.balanceIds[0] !== ''}
                <div
                    class="grid grid-cols-2 gap-2"
                    transition:slide={{ duration: 300 }}
                >
                    <Input
                        label="Importe"
                        id="amount"
                        type="number" 
                        placeholder="Ingrese el importe"
                        required
                        bind:value={linkEdit.amount}
                    />

                    <Input
                        label="Fecha de expiración"
                        id="expirationDate"
                        type="text" 
                        placeholder="Ingrese la fecha de expiración"
                        required
                        bind:value={linkEdit.expirationDate}
                    />
                </div>
            {/if}
        {/if}
    </div>

    <SaveButton
        disabled={isLoadingSave}
        isEdit={linkEdit.id ? true : false}
        styles="mt-6"
    />
</form>
