<script lang="ts">
    type Props = {
        label?   : string;
        id?      : string;
        name?    : string;
        checked? : boolean | undefined;
        padding? : string   | undefined;
        onChange?: () => void;
    }

    let {
        label    = "Switch",
        id       = "switch",
        name     = "switch",
        checked  = $bindable<boolean | undefined>(),
        padding  = "py-2",
        onChange = () => {},
    }: Props = $props();

    if (checked === undefined) {
        checked = false;
    }
    
    function toggle() {
        checked = !checked;
        onChange();
    }
</script>

<div class="flex items-center justify-between gap-4 {padding}">
    <label for={id} class="text-sm font-medium text-primary-800 dark:text-primary-200">
        {label}
    </label>

    <button
        type="button"
        role="switch"
        aria-checked={checked}
        id={id}
        name={name}
        aria-label={`${label} ${checked ? 'activado' : 'desactivado'}`}
        onclick={toggle}
        class="relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border border-primary-500/30 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900 disabled:cursor-not-allowed disabled:opacity-50 backdrop-blur-sm shadow-sm hover:shadow-primary-500/20 {checked ? 'bg-gradient-to-r from-primary-600 to-primary-400' : 'bg-primary-800/50'}"
    >
        <span
            class="pointer-events-none block mt-[0.19rem] h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-300 {checked ? 'translate-x-[24px] bg-primary-900' : 'translate-x-[4px]'}"
        ></span>
    </button>
</div>

<style>
    /* Estilos adicionales para animaciones o efectos específicos */
    button:focus-visible {
        outline: none;
        box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.4);
    }
</style>