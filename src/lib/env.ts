import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required for database persistence")
    .default("postgresql://postgres:postgres@localhost:5432/resumeforge?schema=public"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  // AI Providers & Models
  ANTHROPIC_API_KEY: z.string().optional().default(""),
  ANTHROPIC_MODEL: z.string().default("claude-3-5-sonnet-20241022"),
  OPENAI_API_KEY: z.string().optional().default(""),
  OPENAI_MODEL: z.string().default("gpt-4o"),

  // Auth (NextAuth / Auth.js)
  AUTH_SECRET: z.string().min(16).default("resumeforge_development_secret_key_minimum_32_characters"),
  NEXTAUTH_SECRET: z.string().min(16).default("resumeforge_development_secret_key_minimum_32_characters"),
  NEXTAUTH_URL: z.string().url().default("http://localhost:3000"),

  // OAuth Providers (Optional)
  GOOGLE_CLIENT_ID: z.string().optional().default(""),
  GOOGLE_CLIENT_SECRET: z.string().optional().default(""),
  GITHUB_ID: z.string().optional().default(""),
  GITHUB_SECRET: z.string().optional().default(""),
  GITHUB_ACCESS_TOKEN: z.string().optional().default(""),

  // Email & Reminders (Resend)
  RESEND_API_KEY: z.string().optional().default(""),
  RESEND_FROM_EMAIL: z.string().email().default("onboarding@resend.dev"),

  // S3 / Cloudflare R2 Storage (Optional)
  STORAGE_BUCKET_NAME: z.string().optional().default(""),
  STORAGE_ENDPOINT: z.string().optional().default(""),
  STORAGE_ACCESS_KEY_ID: z.string().optional().default(""),
  STORAGE_SECRET_ACCESS_KEY: z.string().optional().default(""),
  STORAGE_PUBLIC_URL: z.string().optional().default(""),

  // Cron Security
  CRON_SECRET: z.string().default("resumeforge_cron_secret_token"),
});

export type EnvConfig = z.infer<typeof envSchema>;

function validateEnv(): EnvConfig {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error("❌ Invalid environment variables detected at startup:");
    for (const issue of result.error.issues) {
      console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
    }
    // Fail fast in production
    if (process.env.NODE_ENV === "production") {
      throw new Error("Invalid environment configuration. Check logs above.");
    }
    return envSchema.parse({
      ...process.env,
      DATABASE_URL:
        process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/resumeforge?schema=public",
      AUTH_SECRET:
        process.env.AUTH_SECRET ||
        process.env.NEXTAUTH_SECRET ||
        "resumeforge_development_secret_key_minimum_32_characters",
    });
  }

  return result.data;
}

export const env = validateEnv();
