import type { APIRoute, APIContext } from 'astro';
import { ENV_SERVER } from '@/config/envs/env.server';

export const GET: APIRoute = async (context: APIContext) => {
    const userId    = context.locals.userId;
    const token     = context.locals.authToken;
    const baseUrl   = ENV_SERVER.API_BASE_URL;
    const endpoint  = context.params.endpoint;

    const response = await fetch(`${baseUrl}/${endpoint}/user/${userId}`, {
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

export const POST: APIRoute = async (context: APIContext) => {
    const userId    = context.locals.userId;
    const token     = context.locals.authToken;
    const baseUrl   = ENV_SERVER.API_BASE_URL;
    const endpoint  = context.params.endpoint;
    const body      = await context.request.json();
    const url       = `${baseUrl}/${endpoint}`;

    let request: object;

    if ( endpoint === 'payment-details' ) {
        request = {
            month           : body.month,
            year            : body.year,
            userId          : context.locals.userId,
            paymentDetails   : body.paymentDetails
        };
    } else {
        request = {
            ...body,
            userId,
        }
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify( request ),
        });

        const data = await response.json();

        return new Response(JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        return new Response(JSON.stringify(error), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
};
