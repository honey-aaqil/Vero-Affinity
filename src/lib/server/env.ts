import 'server-only';

import { z } from 'zod';

const ServerEnvSchema = z.object({
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  MONGODB_DB: z.string().min(1, 'MONGODB_DB is required'),
  SESSION_SECRET: z.string().min(1, 'SESSION_SECRET is required'),

  ENCRYPTION_SALT: z.string().optional(),
  GRIDFS_MEDIA_BUCKET: z.string().optional(),
});

const parsed = ServerEnvSchema.safeParse(process.env);

if (!parsed.success) {
  const message = parsed.error.issues
    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    .join('\n');

  throw new Error(`Invalid server environment variables:\n${message}`);
}

export const env = parsed.data;
export type ServerEnv = typeof env;
