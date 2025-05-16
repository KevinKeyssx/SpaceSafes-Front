import { z } from 'zod';

const envSchema = z.object({
    PUBLIC_CLERK_PUBLISHABLE_KEY    : z.string(),
    CLERK_SECRET_KEY                : z.string(),
    API_BASE_URL                    : z.string(),
});

export const ENV_SERVER = envSchema.parse(import.meta.env);
export type Env = z.infer<typeof envSchema>;
