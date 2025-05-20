<script lang="ts">
	import type { Snippet } from "svelte";

    import { Popover } from "bits-ui";
    import PatternBackground from "../PatternBackground.svelte";

    type Props = {
		open?: boolean;
		trigger: Snippet;
		content: Snippet;
	};

    let {
        open = $bindable(),
        trigger,
        content
    }: Props = $props();
</script>

<Popover.Root bind:open>
    <Popover.Trigger
    >
        {@render trigger()}
    </Popover.Trigger>

    <Popover.Portal>
        <Popover.Content
            class="z-50 bg-primary-100 dark:bg-primary-800 text-primary-300 border-none ring-1 ring-primary-400 shadow-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 w-full max-w-[328px] rounded-[12px] p-4"
            sideOffset={8}
            align="end"
            alignOffset={-55}

        >
        <PatternBackground />
            {@render content()}
        </Popover.Content>
    </Popover.Portal>
</Popover.Root>