import { eq, ilike } from "drizzle-orm"
import { db } from "../db/index.js"
import { todosTable } from "../db/schema.js"

function errMsg(e: unknown): string {
  return `Error: ${e instanceof Error ? e.message : String(e)}`
}

export async function getAllTodos() {
  try {
    return await db.select().from(todosTable)
  } catch (e) {
    return errMsg(e)
  }
}

export async function createTodo(todo: string) {
  try {
    const [row] = await db
      .insert(todosTable)
      .values({ todo })
      .returning({ id: todosTable.id })
    return row?.id ?? "Error: insert returned no id"
  } catch (e) {
    return errMsg(e)
  }
}

export async function updateTodo(id: number, todo: string) {
  try {
    await db.update(todosTable).set({ todo }).where(eq(todosTable.id, id))
    return "Updated successfully"
  } catch (e) {
    return errMsg(e)
  }
}

export async function deleteTodoById(id: number) {
  try {
    await db.delete(todosTable).where(eq(todosTable.id, id))
    return "Deleted successfully"
  } catch (e) {
    return errMsg(e)
  }
}

export async function searchTodo(query: string) {
  try {
    return await db
      .select()
      .from(todosTable)
      .where(ilike(todosTable.todo, `%${query}%`))
  } catch (e) {
    return errMsg(e)
  }
}
