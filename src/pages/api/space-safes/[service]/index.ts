import type { APIRoute, APIContext } from 'astro';
import { ENV_SERVER } from '@/config/envs/env.server';

export const GET: APIRoute = async (context: APIContext) => {
    const userId    = context.locals.userId;
    const token     = context.locals.authToken;
    const baseUrl   = ENV_SERVER.API_BASE_URL;
    const path      = context.params.service;

    const response = await fetch(`${baseUrl}/${path}/user/${userId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    const accounts = await response.json();

    return new Response(JSON.stringify(accounts), {
        headers: {
        'Content-Type': 'application/json',
        },
    });
};
