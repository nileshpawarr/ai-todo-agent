import { startCLI } from "./cli/index.js"
import { runReactAgent } from "./agents/react/index.js"
import { runNativeAgent } from "./agents/native/index.js"

const agentType = process.argv[2]

if (agentType !== "react" && agentType !== "native") {
  console.error("Usage: tsx src/index.ts <react|native>")
  process.exit(1)
}

const runAgent = agentType === "react" ? runReactAgent : runNativeAgent
console.log(`\nStarting ${agentType.toUpperCase()} agent...\n`)

await startCLI(runAgent)
