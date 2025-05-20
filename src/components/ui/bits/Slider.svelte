<script lang="ts">
    import { Slider } from "bits-ui";

    export let value: number;
    export let onValueChange: () => void = () => {};
    export let min: number = 0;
    export let max: number = 100;


    function handleBitsSliderChange(newValueFromEvent: number): void {
        if ( value === newValueFromEvent )  return;

        value = newValueFromEvent;
        onValueChange();
    }
</script>

<div class="w-full md:max-w-[280px]">
    <Slider.Root
        type="single"
        value={value}
        class="relative flex w-full touch-none select-none items-center"
        onValueChange={handleBitsSliderChange}
        min={min}
        max={max}
        step={1}
    >
        {#snippet children()}
            <span class="bg-primary-800 dark:bg-primary-700 relative h-2 w-full grow cursor-pointer overflow-hidden rounded-full">
                <Slider.Range class="bg-primary-500 absolute h-full" />
            </span>
            <Slider.Thumb
                index={0}
                class="block h-5 w-5 rounded-full border-2 border-primary-300 bg-white dark:bg-slate-100 dark:border-slate-400 shadow-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 dark:focus-visible:ring-primary-600 focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
            />
        {/snippet}
    </Slider.Root>
</div>