<script lang="ts">
	import type { Snippet } from "svelte";

    import { Dialog, type WithoutChild } from "bits-ui";

    import PatternBackground    from "@/components/ui/PatternBackground.svelte";
	import GlowEffects          from "@/components/ui/GlowEffects.svelte";


    type Props = Dialog.RootProps & {
		buttonText?      : string;
		title           : Snippet;
		description?    : Snippet;
        iconButton?     : Snippet;
        openButtonClass? : string;
        onSave?         : () => void;
		contentProps?   : WithoutChild<Dialog.ContentProps>;
		// ...other component props if you wish to pass them
	};


	let {
		open = $bindable(false),
		children,
		buttonText,
		contentProps,
		title,
		description,
        iconButton,
        openButtonClass = "rounded-xl gap-1 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 text-white shadow-lg hover:shadow-xl hover:shadow-primary-500/20 focus-visible:ring-primary-400 focus-visible:ring-offset-background focus-visible:outline-hidden inline-flex h-12 items-center justify-center whitespace-nowrap px-[21px] text-[15px] font-semibold transition-all duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] hover:scale-[1.01] backdrop-blur-lg border border-primary-600/30",
        onSave,
		...restProps
	}: Props = $props();
</script>

<Dialog.Root bind:open {...restProps}>
	<Dialog.Trigger
        class={openButtonClass}
    >
        {#if iconButton}
            {@render iconButton()}
        {/if}
        {buttonText}
	</Dialog.Trigger>

    <Dialog.Portal>
		<Dialog.Overlay class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"/>

        <Dialog.Content {...contentProps}
            class="rounded-xl bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 shadow-xl shadow-primary-500/20 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 outline-hidden fixed inset-0 m-auto z-50 w-full max-w-[calc(100%-2rem)] max-h-[85vh] h-fit border border-primary-600/30 p-6 sm:max-w-[490px] md:w-full backdrop-blur-xl overflow-hidden"
        >
			<div class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent opacity-40"></div>

            <PatternBackground patternId="dialogPattern" />

            <GlowEffects />

			<div class="relative z-10">
				<Dialog.Title class="flex w-full items-center justify-center text-xl font-bold text-white mb-4 drop-shadow-sm tracking-tight">
					{@render title()}
				</Dialog.Title>

				<div class="h-px w-full bg-gradient-to-r from-transparent via-primary-400/30 to-transparent my-4"></div>

				<Dialog.Description class="text-primary-200 text-center mb-3">
					{@render description?.()}
				</Dialog.Description>

				{@render children?.()}

				<div class="h-px w-full bg-gradient-to-r from-transparent via-primary-400/30 to-transparent my-4"></div>

				<div class="mt-3 flex justify-end gap-2">
					<Dialog.Close class="inline-flex items-center px-4 py-2 bg-primary-600/40 hover:bg-primary-500/50 rounded-full text-white transition-all duration-300 backdrop-blur-sm shadow-sm hover:scale-105">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
						Cerrar
					</Dialog.Close>

                    {#if onSave}
                        <button 
                            type    = "button" 
                            onclick = { onSave }
                            class   = "px-4 py-2 bg-primary-600/40 hover:bg-primary-500/50 rounded-full text-white transition-all duration-300 backdrop-blur-sm shadow-sm hover:scale-105"
                        >
                            Guardar
                        </button>
                    {/if}
				</div>
			</div>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>

<style>
	/* Estilos adicionales para animaciones o efectos específicos */
	:global(.dialog-content-enter) {
		opacity: 0;
		transform: scale(0.96);
	}

	:global(.dialog-content-enter-active) {
		opacity: 1;
		transform: scale(1);
		transition: opacity 0.3s, transform 0.3s;
	}

	:global(.dialog-content-exit) {
		opacity: 1;
	}

	:global(.dialog-content-exit-active) {
		opacity: 0;
		transition: opacity 0.2s;
	}
</style>