import { clerkMiddleware, createRouteMatcher } from "@clerk/astro/server";

const matcher = createRouteMatcher( ["/dashboard(.*)"] );

export const onRequest = clerkMiddleware(async ( auth, context ) => {
    const { userId, redirectToSignIn, getToken } = auth();

    if ( matcher( context.request ) && !userId ) {
        return redirectToSignIn();
    }

    const token = await getToken();

    context.locals.userId       = userId;
    context.locals.authToken    = token;
});
