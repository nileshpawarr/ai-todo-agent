import readlineSync from "readline-sync"
import readline from "readline"
import { renderer } from "./renderer.js"

export async function startCLI(
  runAgent: (query: string) => Promise<void>
): Promise<void> {
  console.log("Todo Agent ready. Type your request or press Ctrl+C to exit.\n")

  process.on("SIGINT", () => {
    console.log("\nGoodbye!")
    process.exit(0)
  })

  if (!process.stdin.isTTY) {
    // Non-interactive (piped) mode: read lines from stdin
    const rl = readline.createInterface({ input: process.stdin })
    for await (const line of rl) {
      if (!line.trim()) continue
      try {
        await runAgent(line)
      } catch (e) {
        renderer.error(e instanceof Error ? e.message : String(e))
      }
    }
    return
  }

  while (true) {
    const query = readlineSync.question(">> ")
    if (!query.trim()) continue
    try {
      await runAgent(query)
    } catch (e) {
      renderer.error(e instanceof Error ? e.message : String(e))
    }
  }
}
