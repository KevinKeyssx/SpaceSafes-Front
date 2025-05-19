import type { APIRoute, APIContext } from 'astro';
import { ENV_SERVER } from '@/config/envs/env.server';


export const GET: APIRoute = async (context: APIContext) => {
    const userId    = context.locals.userId;
    const token     = context.locals.authToken;
    const { month, year } = context.params;
    const baseUrl   = ENV_SERVER.API_BASE_URL;

    const response = await fetch(`${baseUrl}/payment-details/${userId}/${month}/${year}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};