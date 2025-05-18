<script lang="ts">
    import MagnifyingGlass from "phosphor-svelte/lib/MagnifyingGlass";
    import { onMount } from 'svelte';

    type Option = {
        value: string;
        label: string;
    };

    export let id = "";
    export let name = "";
    export let value = "";
    export let label = "";
    export let placeholder = "Select an option";
    export let options: Option[] = [];
    export let required = false;
    export let disabled = false;

    // Initialize inputValue with empty string
    let inputValue = "";
    let showDropdown = false;
    let filteredOptions: Option[] = [];
    
    // Set initial inputValue based on the provided value
    function initializeInputValue() {
        if (value && options.length > 0) {
            const option = options.find(opt => opt.value === value);
            if (option) {
                inputValue = option.label;
            }
        }
        updateFilteredOptions();
    }
    
    function updateFilteredOptions() {
        filteredOptions = options.filter(option => 
            option.label.toLowerCase().includes(inputValue.toLowerCase())
        );
    }
    
    function selectOption(option: Option) {
        value = option.value;
        inputValue = option.label;
        showDropdown = false;
    }

    function handleInputFocus() {
        showDropdown = true;
    }

    function handleInputBlur() {
        // Delay hiding dropdown to allow click events to register
        setTimeout(() => {
            showDropdown = false;
        }, 200);
    }
    
    function handleInputChange() {
        updateFilteredOptions();
    }
    
    // Initialize when component is mounted
    onMount(() => {
        initializeInputValue();
    });
    
    // Watch for changes to value or options
    $: if (value || options) {
        initializeInputValue();
    }
</script>

<div class="flex flex-col gap-2 w-full">
    {#if label}
        <label for={id} class="text-sm font-medium text-primary-200">{label}</label>
    {/if}

    <div class="relative">
        <div class="flex items-center h-10 w-full px-4 py-2 bg-primary-800/50 border-none ring-1 ring-primary-400 hover:ring-primary-500 focus-within:ring-2 rounded-xl text-primary-300 transition-all duration-300 backdrop-blur-sm shadow-sm">
            <MagnifyingGlass class="text-primary-400 mr-2 size-4" />
            <input
                type="search"
                {id}
                {name}
                {required}
                {disabled}
                bind:value={inputValue}
                placeholder={placeholder}
                on:focus={handleInputFocus}
                on:blur={handleInputBlur}
                on:input={handleInputChange}
                class="bg-transparent border-none focus:ring-0 focus:border-none outline-none text-primary-300 w-full placeholder-primary-400/50"
            />
        </div>

        {#if showDropdown && filteredOptions.length > 0}
            <div class="absolute z-10 mt-1 w-full bg-primary-800/90 border-none ring-1 ring-primary-400 shadow-lg rounded-xl overflow-hidden">
                <div class="max-h-48 overflow-y-auto py-1">
                    {#each filteredOptions as option}
                        <button
                            type="button"
                            class="w-full text-left px-4 py-2 hover:bg-primary-500/20 text-primary-300 {value === option.value ? 'bg-primary-500/30 text-primary-200' : ''}"
                            on:click={() => selectOption(option)}
                        >
                            {option.label}
                        </button>
                    {/each}
                </div>
            </div>
        {/if}
    </div>
</div>