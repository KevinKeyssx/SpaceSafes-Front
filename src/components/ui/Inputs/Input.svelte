<script lang="ts">
    type Props = {
        placeholder?    : string;
        id?             : string;
        name?           : string;
        value?          : string;
        label?          : string;
        type?           : 'text' | 'email' | 'password' | 'number' | 'search';
        required?       : boolean;
        disabled?       : boolean;
        min?            : number;
        max?            : number;
        onClick?        : () => void;
    }


    let {
        placeholder = "",
        id          = "",
        name        = "",
        value       = $bindable<string>(),
        label       = "",
        type        = 'text',
        required    = false,
        disabled    = false,
        min         = undefined,
        max         = undefined,
        onClick     = undefined,
    }: Props = $props();
</script>

<div class="flex flex-col gap-2 w-full">
    {#if label}
        <label for={id} class="text-sm font-medium text-primary-200">{label}</label>
    {/if}

    <input
        bind:value={ value }
        type            = { type }
        placeholder     = { placeholder }
        class           = "disabled:opacity-50 h-10 w-full px-4 py-2 bg-primary-800/50 border-none ring-1 ring-primary-400 hover:ring-primary-500 focus:ring-2 rounded-xl focus:outline-none text-primary-300 placeholder-primary-300 transition-all duration-300 backdrop-blur-sm shadow-sm {type === 'number' ? 'number-input-custom' : ''}"
        data-section    = { id }
        id              = { id }
        name            = { name }
        required        = { required }
        disabled        = { disabled }
        min             = { min }
        max             = { max }
        onclick         = { onClick }
    />
</div>

<style>
    /* Estilos para los controles de incremento/decremento en Chrome, Safari, Edge, Opera */
    :global(input[type=number]::-webkit-outer-spin-button),
    :global(input[type=number]::-webkit-inner-spin-button) {
        -webkit-appearance: none;
        appearance: none;
        margin: 0;
    }
    
    /* Para Firefox */
    :global(input[type=number]) {
        -moz-appearance: textfield;
        appearance: textfield;
    }
    
    /* Estilo personalizado para los controles de número */
    :global(input[type=number].number-input-custom) {
        position: relative;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='28' viewBox='0 0 16 28'%3E%3Cpath d='M8 8l4 4H4l4-4z' fill='%23A855F7'/%3E%3Cpath d='M8 20L4 16h8l-4 4z' fill='%23A855F7'/%3E%3C/svg%3E");
        background-position: right 8px center;
        background-repeat: no-repeat;
        background-size: 16px auto;
        padding-right: 30px;
    }
    
    /* Estilo para el estado hover */
    :global(input[type=number].number-input-custom:hover) {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='28' viewBox='0 0 16 28'%3E%3Cpath d='M8 8l4 4H4l4-4z' fill='%23C084FC'/%3E%3Cpath d='M8 20L4 16h8l-4 4z' fill='%23C084FC'/%3E%3C/svg%3E");
    }
    
    /* Estilo para el estado focus */
    :global(input[type=number].number-input-custom:focus) {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='28' viewBox='0 0 16 28'%3E%3Cpath d='M8 8l4 4H4l4-4z' fill='%23D8B4FE'/%3E%3Cpath d='M8 20L4 16h8l-4 4z' fill='%23D8B4FE'/%3E%3C/svg%3E");
    }
    
    /* Estilos para el autofill */
    :global(input:-webkit-autofill),
    :global(input:-webkit-autofill:hover),
    :global(input:-webkit-autofill:focus) {
        -webkit-text-fill-color: white;
        -webkit-box-shadow: 0 0 0px 1000px rgba(79, 70, 229, 0.2) inset;
        transition: background-color 5000s ease-in-out 0s;
    }
    
    /* Estilos para el focus */
    :global(input:focus) {
        box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.25);
    }
    
    /* Estilos para el placeholder */
    :global(input::placeholder) {
        opacity: 0.5;
    }
</style>