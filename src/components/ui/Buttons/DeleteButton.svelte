<script lang="ts">
    import Dialog from "../bits/Dialog.svelte";
    import LoadIcon from "@/icons/LoadIcon.svelte";
    import DeleteIcon from "@/icons/DeleteIcon.svelte";

    export let confirmDelete: () => void;
    export let name : string;
    export let disabled: boolean;
    export let styles : string = 'absolute bottom-4 left-4 ';


    let openDelete = false;
</script>

<Dialog
    openButtonClass="{ styles} bg-rose-300 hover:bg-rose-400 shadow-lg p-1 rounded-lg transition-colors duration-300"
    bind:open={openDelete}
>
    {#snippet iconButton()}
        <DeleteIcon />
    {/snippet}

    {#snippet title()}
        Eliminar {name}
    {/snippet}

    <div class="space-y-2 w-full">
        <p class="text-primary-200 grid text-center">¿Estás seguro de eliminar el {name}?
            <span class="text-primary-500">
                Esta acción no se puede deshacer.
            </span>
        </p>

        <button 
            type="button"
            {disabled}
            on:click={confirmDelete}
            class="disabled:opacity-50 mx-auto gap-2 flex justify-center px-4 py-1 w-48 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
            {#if disabled}
                <LoadIcon />
            {:else}
                <DeleteIcon />
            {/if}

            Eliminar {name}
        </button>
    </div>
</Dialog>
