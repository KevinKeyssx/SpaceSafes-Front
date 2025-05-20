<script lang="ts">
    export let strokeColor  : string = "white"; // Color del trazo
    export let strokeWidth  : number = 0.5; // Ancho del trazo
    export let gridSize     : number = 10; // Tamaño de la cuadrícula
    export let patternId    : string = "smallGrid"; // ID único para el patrón
</script>

<div class="absolute inset-0 w-full h-full transition-transform duration-300 group-hover:scale-[1.02] z-0 pointer-events-none">
    <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent opacity-40"></div>
    <div class="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="{patternId}" width="{gridSize}" height="{gridSize}" patternUnits="userSpaceOnUse">
                    <path d="M {gridSize} 0 L 0 0 0 {gridSize}" fill="none" stroke="{strokeColor}" stroke-width="{strokeWidth}" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#{patternId})" />
        </svg>
    </div>
</div>
