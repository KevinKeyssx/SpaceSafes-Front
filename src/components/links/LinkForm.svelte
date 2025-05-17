
<script lang="ts">
    import { slide } from 'svelte/transition';

    import Input            from "@/components/ui/Inputs/Input.svelte";
    import Switch           from "@/components/ui/Inputs/Switch.svelte";
    import { loadSpaceSafes } from '@/services/fetch/getSpaceSafes';
    import type { Link, LinkSave } from '@/models/links/link.model';
    import { addLink, updateLink } from '@/stores/linksStore';
    import OutlineButton from '../ui/Buttons/OutlineButton.svelte';
    import { WebsiteCategory } from '@/models/links/enum/web-category.enum';
    import Combobox from '../ui/Inputs/Combobox.svelte';


    export let link: LinkSave = {} as LinkSave;
    export let open : boolean;


    let linkEdit = { 
        ...link,
        category: link.category || "",
        isFavorite: link.isFavorite || false
    };

    const oldUrl = link.url || "";

    if ( !link.id || link.balanceIds.length === 0 ) {
        linkEdit.balanceIds = [];
    }

    let navlyContainer: HTMLDivElement;


    function addBalanceId(): void {
        linkEdit.balanceIds = [...linkEdit.balanceIds, ''];

        setTimeout(() => {
            if (navlyContainer) {
                navlyContainer.scrollTop = navlyContainer.scrollHeight;
            }
        }, 310);
    }


    function removeBalanceId( index: number ): void {
        linkEdit.balanceIds = [...linkEdit.balanceIds.filter((_, i) => i !== index)];
    }


    async function createLink(): Promise<void> {
        console.log('🚀 ~ file: LinkForm.svelte:53 ~ linkEdit:', linkEdit)
        const savedLink = await loadSpaceSafes<Link>({
            url: `/api/space-safes/navly`,
            method: 'POST',
            data: linkEdit
        });

        console.log('🚀 ~ file: LinkForm.svelte:56 ~ savedLink:', savedLink)
        if (!savedLink) {
            return;
        }

        addLink(savedLink);
        open = false;
    }


    async function updatedLink() {
        const {
            url,
            avatar,
            balanceIds,
            id,
            ...rest
        } = linkEdit;

        const updatedLinkEdit = {
            ...rest,
            ...( oldUrl !== linkEdit.url && { url }),
        };

        const savedLink = await loadSpaceSafes<Link>({
            url: `/api/space-safes/navly/${linkEdit.id}`,
            method: 'PATCH',
            data: updatedLinkEdit
        });

        if ( !savedLink ) {
            return;
        }

        updateLink( savedLink );
        open = false;
    }


    async function saveLink(): Promise<void> {
        if ( !linkEdit.id ) {
            createLink();
            return;
        }

        updatedLink();
    }

    let disabledName = true;
    let disabledDescription = true;
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

        <div bind:this={navlyContainer} class="flex flex-col gap-2 max-h-60 overflow-auto p-1">
            {#each linkEdit.balanceIds as balanceId}
                <div
                    class=" flex gap-2 w-full"
                    transition:slide={{ duration: 300 }}
                >
                    <Input
                        id="account-navly"
                        type="text"
                        bind:value={balanceId}
                    />

                    <OutlineButton
                        onClick={() => removeBalanceId(linkEdit.balanceIds.indexOf(balanceId))}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-dasharray="16" stroke-dashoffset="16" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="16;0"/></path></svg>
                    </OutlineButton>
                </div>
            {/each}
        </div>

        <button
            type="button"
            on:click={addBalanceId}
            class="w-full mt-1 mx-auto rounded-lg text-center justify-center items-center px-4 py-1 ring-2 ring-primary-500 hover:bg-primary-700 text-white transition-colors flex"
            aria-label="Agregar enlace"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-dasharray="16" stroke-dashoffset="16" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M5 12h14"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="16;0"/></path><path d="M12 5v14"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.4s" values="16;0"/></path></g></svg>
        </button>
    </div>

    <button
        type="submit"
        class="px-4 mt-6 w-full py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
    >
        Guardar
    </button>
</form>
