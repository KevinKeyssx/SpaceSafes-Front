import type { APIRoute, APIContext } from 'astro';
import { ENV_SERVER } from '@/config/envs/env.server';

export const PATCH: APIRoute = async (context: APIContext<{ path: string, id: string }>) => {
    const userId        = context.locals.userId;
    const token         = context.locals.authToken;
    const baseUrl       = ENV_SERVER.API_BASE_URL;
    const { path, id }  = context.params;
    const body          = await context.request.json();
    const url           = `${baseUrl}/${path}/${id}`;

    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify( body ),
        });

        const data = await response.json();

        return new Response(JSON.stringify( data ), {
            headers: {
            'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        return new Response(JSON.stringify( error ), {
            headers: {
            'Content-Type': 'application/json',
            },
        });
    }
};



export const DELETE: APIRoute = async (context: APIContext<{ path: string, id: string }>) => {
    const userId        = context.locals.userId;
    const token         = context.locals.authToken;
    const baseUrl       = ENV_SERVER.API_BASE_URL;
    const { path, id }  = context.params;
    const url           = `${baseUrl}/${path}/${id}`;

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });

        const data = await response.json();

        return new Response(JSON.stringify( data ), {
            headers: {
            'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        return new Response(JSON.stringify( error ), {
            headers: {
            'Content-Type': 'application/json',
            },
        });
    }
};
