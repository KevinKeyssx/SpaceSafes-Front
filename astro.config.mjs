import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import svelte from '@astrojs/svelte';
import node from "@astrojs/node";
import clerk from "@clerk/astro";
import { esES } from "@clerk/localizations";

export default defineConfig({
    integrations: [
        tailwind(),
        svelte(),
        clerk({
            localization: esES
        })
    ],
    adapter: node({ mode: "standalone" }),
    output: "server",
});