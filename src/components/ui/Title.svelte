<script lang="ts">
    import PatternBackground from '../ui/PatternBackground.svelte';
</script>

<header class="relative animate-slide-up flex flex-col sm:flex-row justify-between items-center p-4 bg-primary-50 dark:bg-primary-800 rounded-lg shadow border border-primary-200 dark:border-primary-700 mb-6">
    <PatternBackground patternId="title" />

    <h1 class="text-2xl font-bold mb-2 sm:mb-0 text-primary-500 dark:text-primary-400">
        <slot name="title"/>
    </h1>

    <slot name="content"/>
</header>
