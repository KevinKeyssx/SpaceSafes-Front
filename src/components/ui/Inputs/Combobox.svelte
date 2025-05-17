<script lang="ts">
    import MagnifyingGlass from "phosphor-svelte/lib/MagnifyingGlass";

    type Option = {
        value: string;
        label: string;
    };

    type Props = {
        id?: string;
        name?: string;
        value?: string;
        label?: string;
        placeholder?: string;
        options?: Option[];
        required?: boolean;
        disabled?: boolean;
    }

    let {
        id = "",
        name = "",
        value = $bindable<string>(""),
        label = "",
        placeholder = "Select an option",
        options = [],
        required = false,
        disabled = false,
    }: Props = $props();

    // Initialize inputValue with empty string
    let inputValue = $state("");
    let showDropdown = $state(false);
    
    // Set initial inputValue based on the provided value
    function initializeInputValue() {
        if (value && options.length > 0) {
            const option = options.find(opt => opt.value === value);
            if (option) {
                inputValue = option.label;
            }
        }
    }
    
    // Initialize when component is mounted
    initializeInputValue();
    
    function selectOption(option: Option) {
        value = option.value;
        inputValue = option.label;
        showDropdown = false;
    }
    
    // Update inputValue whenever value or options change
    $effect(() => {
        initializeInputValue();
    });

    function handleInputFocus() {
        showDropdown = true;
    }

    function handleInputBlur() {
        // Delay hiding dropdown to allow click events to register
        setTimeout(() => {
            showDropdown = false;
        }, 200);
    }

    const filteredOptions = $derived(
        options.filter(option => 
            option.label.toLowerCase().includes(inputValue.toLowerCase())
        )
    );
</script>

<div class="flex flex-col gap-2 w-full">
    {#if label}
        <label for={id} class="text-sm font-medium text-primary-200">{label}</label>
    {/if}

    <div class="relative">
        <div class="flex items-center h-10 w-full px-4 py-2 bg-primary-800/50 border-none ring-1 ring-primary-400 hover:ring-primary-500 focus-within:ring-2 rounded-xl text-primary-300 transition-all duration-300 backdrop-blur-sm shadow-sm">
            <MagnifyingGlass class="text-primary-400 mr-2 size-4" />
            <input
                type="text"
                {id}
                {name}
                {required}
                {disabled}
                bind:value={inputValue}
                placeholder={placeholder}
                onfocus={handleInputFocus}
                onblur={handleInputBlur}
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
                            onclick={() => selectOption(option)}
                        >
                            {option.label}
                        </button>
                    {/each}
                </div>
            </div>
        {/if}
    </div>
</div>