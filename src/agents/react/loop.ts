import Anthropic from "@anthropic-ai/sdk"
import { env } from "../../config/env.js"
import { renderer } from "../../cli/renderer.js"
import { REACT_SYSTEM_PROMPT } from "./prompt.js"
import * as tools from "../../tools/index.js"

const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY })

type ReactStep =
  | { type: "plan"; plan: string }
  | { type: "action"; function: string; input: string }
  | { type: "output"; output: string }

async function callClaude(history: string): Promise<ReactStep> {
  const response = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 1024,
    system: REACT_SYSTEM_PROMPT,
    messages: [{ role: "user", content: history }],
  })
  const block = response.content[0]
  const text = block?.type === "text" ? block.text : ""
  return JSON.parse(text) as ReactStep
}

async function dispatchTool(name: string, input: string): Promise<string> {
  switch (name) {
    case "getAllTodos":
      return JSON.stringify(await tools.getAllTodos())
    case "createTodo":
      return String(await tools.createTodo(input))
    case "searchTodo":
      return JSON.stringify(await tools.searchTodo(input))
    case "deleteTodoById":
      return String(await tools.deleteTodoById(Number(input)))
    case "updateTodo": {
      const pipeIdx = input.indexOf("|")
      if (pipeIdx === -1) return 'Error: updateTodo input must be "id|new text"'
      const id = Number(input.slice(0, pipeIdx))
      const todo = input.slice(pipeIdx + 1)
      return String(await tools.updateTodo(id, todo))
    }
    default:
      return `Error: unknown tool "${name}"`
  }
}

export async function runReactAgent(query: string): Promise<void> {
  let history = `{"type": "user", "user": ${JSON.stringify(query)}}`

  for (let i = 0; i < 20; i++) {
    let step: ReactStep
    try {
      step = await callClaude(history)
    } catch (e) {
      renderer.error(`Failed to parse Claude response: ${e instanceof Error ? e.message : String(e)}`)
      break
    }

    history += `\n${JSON.stringify(step)}`

    if (step.type === "plan") {
      renderer.plan(step.plan)
    } else if (step.type === "action") {
      renderer.action(step.function, step.input)
      const observation = await dispatchTool(step.function, step.input)
      renderer.observation(observation)
      history += `\n${JSON.stringify({ type: "observation", observation })}`
    } else if (step.type === "output") {
      renderer.output(step.output)
      break
    }
  }
}
