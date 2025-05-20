<script lang="ts">
    import { DatePicker } from "bits-ui";
    import CalendarBlank from "phosphor-svelte/lib/CalendarBlank";
    import CaretLeft from "phosphor-svelte/lib/CaretLeft";
    import CaretRight from "phosphor-svelte/lib/CaretRight";

    import {
        CalendarDate,
        type DateValue
    }                       from "@internationalized/date";
    
    // Component properties
    export let id = "";
    export let name = "";
    export let value: DateValue | string | undefined = undefined;
    export let label = "";
    export let disabled = false;
    export let weekdayFormat: "narrow" | "short" | "long" = "short";
    export let fixedWeeks = true;

    $: {
        if (typeof value === 'string') {
            if ( value === '' ) {
                value = undefined;
            } else {
                if ( value.includes('T') ) {
                    value = value.split('T')[0];
                }
                
                const [year, month, day] = value.split('-');
                value = new CalendarDate(Number(year), Number(month), Number(day));
            }
        }
    }
</script>
    
    <DatePicker.Root
        bind:value={value as DateValue}
        {weekdayFormat}
        {fixedWeeks}
        {disabled}
        locale="es-ES"
        placeholder={undefined}
    >
        <div class="flex flex-col gap-2 w-full">
        {#if label}
            <label for={id} class="text-sm font-medium text-primary-800 dark:text-primary-200">{label}</label>
        {/if}
        <DatePicker.Input
            {id}
            {name}
            class="flex h-10 w-full px-4 py-2 border-none ring-1 focus-within:ring-2 rounded-xl transition-all duration-300 backdrop-blur-sm shadow-sm select-none items-center text-sm tracking-[0.01em] bg-primary-50 text-primary-800 ring-primary-300 hover:ring-primary-400 focus-within:ring-primary-500 dark:bg-primary-800 dark:text-primary-300 dark:ring-primary-400 dark:hover:ring-primary-500 dark:focus-within:ring-primary-500"
        >
            {#snippet children({ segments })}
            {#each segments as { part, value }}
                <div class="inline-block select-none">
                {#if part === "literal"}
                    <DatePicker.Segment {part} class="text-primary-600 dark:text-primary-400 p-1">
                    {value}
                    </DatePicker.Segment>
                {:else}
                    <DatePicker.Segment
                    {part}
                    class="rounded-md px-1 py-1 hover:bg-primary-200/60 focus:bg-primary-200/60 focus:text-primary-800 aria-[valuetext=Empty]:text-primary-500/70 dark:hover:bg-primary-500/20 dark:focus:bg-primary-500/20 dark:focus:text-primary-200 dark:aria-[valuetext=Empty]:text-primary-400/50 focus-visible:ring-0! focus-visible:ring-offset-0!"
                    >
                    {value}
                    </DatePicker.Segment>
                {/if}
                </div>
            {/each}
            <DatePicker.Trigger
                class="ml-auto inline-flex size-8 items-center justify-center rounded-md transition-all text-primary-600 hover:bg-primary-200/60 active:bg-primary-300/70 dark:text-primary-400 dark:hover:bg-primary-500/20 dark:active:bg-primary-500/30"
            >
                <CalendarBlank class="size-8" />
            </DatePicker.Trigger>
            {/snippet}
        </DatePicker.Input>
        <DatePicker.Content
            sideOffset={17}
            align="end"
            alignOffset={-17}
            class="z-50"
        >
            <DatePicker.Calendar
            class="border-none ring-1 shadow-lg rounded-xl p-5 bg-primary-50 ring-primary-300 dark:bg-primary-800 dark:ring-primary-400"
            >
            {#snippet children({ months, weekdays })}
                <DatePicker.Header class="flex items-center justify-between">
                <DatePicker.PrevButton
                    class="rounded-xl inline-flex size-10 items-center justify-center transition-all active:scale-[0.98] bg-primary-100/70 hover:bg-primary-200/70 dark:bg-primary-800/50 dark:hover:bg-primary-500/20"
                >
                    <CaretLeft class="size-4 text-primary-700 dark:text-primary-300" />
                </DatePicker.PrevButton>
                <DatePicker.Heading class="text-[15px] font-medium text-primary-800 dark:text-primary-200" />
                <DatePicker.NextButton
                    class="rounded-xl inline-flex size-10 items-center justify-center transition-all active:scale-[0.98] bg-primary-100/70 hover:bg-primary-200/70 dark:bg-primary-800/50 dark:hover:bg-primary-500/20"
                >
                    <CaretRight class="size-4 text-primary-700 dark:text-primary-300" />
                </DatePicker.NextButton>
                </DatePicker.Header>
                <div
                class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0"
                >
                {#each months as month}
                    <DatePicker.Grid
                    class="w-full border-collapse select-none space-y-1"
                    >
                    <DatePicker.GridHead>
                        <DatePicker.GridRow class="mb-1 flex w-full">
                        {#each weekdays as day}
                            <DatePicker.HeadCell
                            class="font-normal! w-10 rounded-md text-xs flex items-center justify-center text-primary-600 dark:text-primary-400"
                            >
                            <div>{day.slice(0, 2)}</div>
                            </DatePicker.HeadCell>
                        {/each}
                        </DatePicker.GridRow>
                    </DatePicker.GridHead>
                    <DatePicker.GridBody>
                        {#each month.weeks as weekDates}
                        <DatePicker.GridRow class="flex w-full">
                            {#each weekDates as date}
                            <DatePicker.Cell
                                {date}
                                month={month.value}
                                class="p-0! relative w-10 text-center text-sm flex items-center justify-center"
                            >
                                <DatePicker.Day
                                class="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border p-0 text-sm font-normal transition-all border-transparent bg-transparent text-primary-700 hover:bg-primary-200/60 data-disabled:pointer-events-none data-disabled:text-primary-400/50 data-unavailable:line-through data-unavailable:text-primary-500/70 data-outside-month:pointer-events-none data-outside-month:text-primary-500/80 data-today:bg-transparent data-today:text-primary-700 data-today:font-normal data-today:border-transparent dark:text-primary-300 dark:hover:bg-primary-500/20 dark:data-disabled:text-primary-400/30 dark:data-unavailable:text-primary-400/50 dark:data-outside-month:text-primary-400/60 dark:data-today:text-primary-300 data-selected:!bg-pink-500 data-selected:!text-white data-selected:!font-bold data-selected:!border-pink-700"
                                >
                                <div
                                    class="absolute top-1 size-1 rounded-full hidden"
                                ></div>
                                {date.day}
                                </DatePicker.Day>
                            </DatePicker.Cell>
                            {/each}
                        </DatePicker.GridRow>
                        {/each}
                    </DatePicker.GridBody>
                    </DatePicker.Grid>
                {/each}
                </div>
            {/snippet}
            </DatePicker.Calendar>
        </DatePicker.Content>
        </div>
    </DatePicker.Root>