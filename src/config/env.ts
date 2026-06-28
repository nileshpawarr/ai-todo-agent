import { z } from "zod"
import "dotenv/config"

const EnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  ANTHROPIC_API_KEY: z.string().min(1),
})

const parsed = EnvSchema.safeParse(process.env)
if (!parsed.success) {
  console.error("Missing or invalid environment variables:")
  console.error(parsed.error.flatten().fieldErrors)
  process.exit(1)
}

export const env = parsed.data
