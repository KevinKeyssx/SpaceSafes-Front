<script lang="ts">
    export let onClick: () => void;
    export let ariaLabel: string = "aria-label";
    export let classProp: string = "";

    const baseClasses = "mb-0.5 w-9 h-9 flex items-center justify-center py-2 ring-1 ring-primary-400 hover:bg-primary-700 text-white rounded-lg transition-colors";
</script>

<button
    type="button"
    on:click={() => onClick()}
    class={`${baseClasses} ${classProp}`.trim()}
    aria-label={ariaLabel}
>
    <slot />
</button>