<script lang="ts">
    // Propiedades para personalizar el patrón
    export let opacity: number = 5; // Opacidad por defecto (en porcentaje)
    export let strokeColor: string = "white"; // Color del trazo
    export let strokeWidth: number = 0.5; // Ancho del trazo
    export let gridSize: number = 10; // Tamaño de la cuadrícula
    export let patternId: string = "smallGrid"; // ID único para el patrón
</script>

<div class="absolute inset-0 opacity-{opacity}">
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <pattern id="{patternId}" width="{gridSize}" height="{gridSize}" patternUnits="userSpaceOnUse">
                <path d="M {gridSize} 0 L 0 0 0 {gridSize}" fill="none" stroke="{strokeColor}" stroke-width="{strokeWidth}" />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#{patternId})" />
    </svg>
</div>
