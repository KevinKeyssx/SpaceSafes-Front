import { clerkMiddleware, createRouteMatcher } from "@clerk/astro/server";

const matcher = createRouteMatcher( ["/dashboard(.*)"] );

export const onRequest = clerkMiddleware(( auth, context ) => {
    const { userId, redirectToSignIn } = auth();

    if ( matcher( context.request ) && !userId ) {
        return redirectToSignIn();
    }

});
