import { z } from 'zod';
import { createEnv } from '@t3-oss/env-core';

export const envServer = createEnv({
    server: {
        DUFFEL_API_KEY: z.string(),
        NODE_ENV: z.enum(['development', 'test', 'production']).default('development')
    },
    runtimeEnv: process.env,
    emptyStringAsUndefined: true
});