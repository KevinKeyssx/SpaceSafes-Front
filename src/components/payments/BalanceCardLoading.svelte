<script lang="ts">
    import { fade } from 'svelte/transition';
    import PatternBackground from '../ui/PatternBackground.svelte';
</script>

<div
    transition:fade={{ duration: 300 }}
    class="w-full relative animate-pulse h-20 ring-1 ring-primary-200 dark:ring-primary-700 rounded-lg cursor-pointer transition-all transform hover:scale-105 shadow-lg "
>
    <PatternBackground patternId="balanceGrid-pending" />
    
    <div class="flex items-center justify-between p-4">
        <div class="flex items-center space-x-2">
            <div class="space-y-1">
                <div class="w-8 h-4 bg-primary-200 dark:bg-primary-700 rounded" />
                <div class="w-24 h-4 bg-primary-200 dark:bg-primary-700 rounded" />
                <div class="w-16 h-3 bg-primary-200 dark:bg-primary-700 rounded" />
            </div>
        </div>
    </div>
</div>
