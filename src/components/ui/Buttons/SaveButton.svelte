<script lang="ts">
    import AddIcon from "@/icons/AddIcon.svelte";
    import EditIcon from "@/icons/EditIcon.svelte";
    import LoadIcon from "@/icons/LoadIcon.svelte";


    export let disabled: boolean;
    export let isEdit: boolean;
    export let type: 'submit' | 'button' = 'submit';
    export let styles: string = '';
</script>

<button
    {type}
    {disabled}
    class="disabled:opacity-50 w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors {styles}"
>
    {#if disabled}
        <LoadIcon />
    {:else if isEdit}
        <EditIcon />
    {:else}
        <AddIcon />
    {/if}

    Guardar
</button>