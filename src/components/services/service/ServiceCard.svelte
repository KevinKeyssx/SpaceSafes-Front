<script lang="ts">
    import type { Service } from "@/models/expenses/expense.model";
    import { fade } from "svelte/transition";

    export let service: Service;
</script>

<div 
    class="bg-primary-50 dark:bg-primary-700 p-3 mb-2 rounded-lg cursor-move hover:shadow-md transition-shadow"
    transition:fade={{ duration: 150 }}
>
    <h3 class="font-medium text-primary-900 dark:text-white">{service.name}</h3>
    <p class="text-sm text-primary-500 dark:text-primary-400">{service.description}</p>
</div>