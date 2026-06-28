import Anthropic from "@anthropic-ai/sdk"
import type { MessageParam, ToolResultBlockParam } from "@anthropic-ai/sdk/resources"
import { env } from "../../config/env.js"
import { renderer } from "../../cli/renderer.js"
import { TODO_TOOLS } from "./schemas.js"
import * as tools from "../../tools/index.js"

const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY })

async function dispatchTool(
  name: string,
  input: Record<string, unknown>
): Promise<string> {
  switch (name) {
    case "getAllTodos":
      return JSON.stringify(await tools.getAllTodos())
    case "createTodo":
      return String(await tools.createTodo(input.todo as string))
    case "updateTodo":
      return String(await tools.updateTodo(input.id as number, input.todo as string))
    case "deleteTodoById":
      return String(await tools.deleteTodoById(input.id as number))
    case "searchTodo":
      return JSON.stringify(await tools.searchTodo(input.query as string))
    default:
      return `Error: unknown tool "${name}"`
  }
}

export async function runNativeAgent(query: string): Promise<void> {
  const messages: MessageParam[] = [{ role: "user", content: query }]

  for (let i = 0; i < 20; i++) {
    const response = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 1024,
      tools: TODO_TOOLS,
      messages,
    })

    messages.push({ role: "assistant", content: response.content })

    if (response.stop_reason === "end_turn") {
      const textBlock = response.content.find((b) => b.type === "text")
      if (textBlock?.type === "text") renderer.output(textBlock.text)
      break
    }

    if (response.stop_reason === "tool_use") {
      const toolResults: ToolResultBlockParam[] = []
      for (const block of response.content) {
        if (block.type !== "tool_use") continue
        renderer.action(block.name, JSON.stringify(block.input))
        const result = await dispatchTool(
          block.name,
          block.input as Record<string, unknown>
        )
        renderer.observation(result)
        toolResults.push({
          type: "tool_result",
          tool_use_id: block.id,
          content: result,
        })
      }
      messages.push({ role: "user", content: toolResults })
    }
  }
}
