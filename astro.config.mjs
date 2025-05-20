import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import svelte from '@astrojs/svelte';
import clerk from "@clerk/astro";
import { esES } from "@clerk/localizations";
import vercel from "@astrojs/vercel";

export default defineConfig({
    output: "server",
    site: 'https://space-safes-front.vercel.app',
    compressHTML: true,
    prefetch: true,
    integrations: [
        tailwind(),
        svelte(),
        clerk({
            localization: esES
        })
    ],
    adapter: vercel(),
    devToolbar: {
        enabled: false
    },
    vite: {
        ssr: {
            noExternal: ["path-to-regexp"],
        },
    },
});