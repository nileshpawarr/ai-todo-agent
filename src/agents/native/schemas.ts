import Anthropic from "@anthropic-ai/sdk"

export const TODO_TOOLS: Anthropic.Tool[] = [
  {
    name: "getAllTodos",
    description: "Get all todo items from the database",
    input_schema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "createTodo",
    description: "Create a new todo item",
    input_schema: {
      type: "object",
      properties: {
        todo: { type: "string", description: "The todo text to add" },
      },
      required: ["todo"],
    },
  },
  {
    name: "updateTodo",
    description: "Update the text of an existing todo item by its id",
    input_schema: {
      type: "object",
      properties: {
        id: { type: "number", description: "The id of the todo to update" },
        todo: { type: "string", description: "The new todo text" },
      },
      required: ["id", "todo"],
    },
  },
  {
    name: "deleteTodoById",
    description: "Delete a todo item by its id",
    input_schema: {
      type: "object",
      properties: {
        id: { type: "number", description: "The id of the todo to delete" },
      },
      required: ["id"],
    },
  },
  {
    name: "searchTodo",
    description: "Search todos by partial text match (case-insensitive)",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string", description: "The search string" },
      },
      required: ["query"],
    },
  },
]
