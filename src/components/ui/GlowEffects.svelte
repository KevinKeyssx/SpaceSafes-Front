<script lang="ts">
    // Propiedades para personalizar los efectos de luz
    export let topLeftColor: string = "primary-600/20"; // Color del efecto superior izquierdo
    export let bottomRightColor: string = "primary-500/20"; // Color del efecto inferior derecho
    export let centerColor: string = "primary-400/5"; // Color del efecto central
    export let showAll: boolean = true; // Mostrar todos los efectos
    export let showTopLeft: boolean = true; // Mostrar efecto superior izquierdo
    export let showBottomRight: boolean = true; // Mostrar efecto inferior derecho
    export let showCenter: boolean = true; // Mostrar efecto central
</script>

<!-- Efectos de luz decorativos -->
{#if showAll || showTopLeft}
    <div class="absolute -top-10 -left-10 w-40 h-40 bg-{topLeftColor} rounded-full blur-2xl"></div>
{/if}

{#if showAll || showBottomRight}
    <div class="absolute -bottom-12 -right-12 w-40 h-40 bg-{bottomRightColor} rounded-full blur-2xl"></div>
{/if}

{#if showAll || showCenter}
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-{centerColor} rounded-full blur-xl opacity-70"></div>
{/if}
