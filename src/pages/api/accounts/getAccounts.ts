import type { APIRoute, APIContext } from 'astro';

export const GET: APIRoute = async (context: APIContext) => {
    const userId = context.locals.userId;
    const token  = context.locals.authToken;

    const response = await fetch(`http://localhost:3017/api/v1/accounts/user/${userId}`, {
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
