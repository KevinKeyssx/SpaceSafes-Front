<script lang="ts">
    import { Select } from "bits-ui";

    import {
        Check,
        CaretUpDown,
        CaretDoubleUp,
        CaretDoubleDown
    } from "phosphor-svelte";

    export let id: string = "";
    export let name: string = "";
    export let value: string = ""; // Changed default to null for clarity
    export let label: string = "";
    export let placeholder: string = "Select an option";
    export let options: { value: string; label: string; disabled?: boolean }[] = [];
    export let required: boolean = false;
    export let disabled: boolean = false;
    export let icon: any = undefined;
    export let onValueChange: (value: string | undefined) => void = () => {};
    // Removed onChange prop, using Svelte's event dispatching instead for two-way binding


    let selectedLabel: string | undefined;
    $: selectedLabel = value
        ? options.find((option) => option.value === value)?.label
        : placeholder;

    // bits-ui onValueChange prop expects a callback of type (value: string | undefined) => void
    
</script>

<div class="flex flex-col gap-2 w-full">
    {#if label}
        <label for={id} class="text-sm font-medium text-primary-200">{label}</label>
    {/if}
    <Select.Root type="single" bind:value={value} onValueChange={onValueChange} items={options} {disabled} {required}>
        <Select.Trigger
            class="disabled:opacity-50 h-10 w-full px-4 py-2 bg-primary-800/50 border-none ring-1 ring-primary-400 hover:ring-primary-500 focus:ring-2 rounded-xl focus:outline-none text-primary-300 flex items-center transition-all duration-300 backdrop-blur-sm shadow-sm"
            aria-label={placeholder}
            disabled={disabled}
            data-section={id}
            id={id}
            name={name}
        >
            {#if icon}
                {#key icon}
                    <div class="text-primary-400 mr-3 size-5">
                        {icon}
                    </div>
                {/key}
            {/if}
            <span class="flex-1 text-left">{selectedLabel}</span>
            <CaretUpDown class="text-primary-400 ml-auto size-5" />
        </Select.Trigger>

        <Select.Portal>
            <Select.Content
                class="bg-primary-800/90 border-none ring-1 ring-primary-400 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 outline-hidden z-[10000] max-h-[var(--bits-select-content-available-height)] w-[var(--bits-select-anchor-width)] min-w-[var(--bits-select-anchor-width)] select-none rounded-xl px-1 py-2 data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1 backdrop-blur-sm"
                sideOffset={2}
            >
                <Select.ScrollUpButton class="flex w-full items-center justify-center text-primary-400 py-1">
                    <CaretDoubleUp class="size-4" />
                </Select.ScrollUpButton>

                <Select.Viewport class="p-1">
                    {#each options as option, i (i + option.value)}
                        <Select.Item
                            class="rounded-md hover:bg-primary-500/20 data-highlighted:bg-primary-500/30 data-highlighted:text-primary-200 outline-hidden data-disabled:opacity-30 flex h-10 w-full select-none items-center py-2 px-3 text-sm text-primary-300 capitalize transition-colors duration-150"
                            value={option.value}
                            label={option.label}
                            disabled={option.disabled}
                        >
                            {#snippet children({ selected })}
                                {option.label}

                                {#if selected}
                                    <div class="ml-auto text-primary-400">
                                        <Check class="size-5" />
                                    </div>
                                {/if}
                            {/snippet}
                        </Select.Item>
                    {/each}
                </Select.Viewport>

                <Select.ScrollDownButton class="flex w-full items-center justify-center text-primary-400 py-1">
                    <CaretDoubleDown class="size-4" />
                </Select.ScrollDownButton>
            </Select.Content>
        </Select.Portal>
    </Select.Root>
</div>