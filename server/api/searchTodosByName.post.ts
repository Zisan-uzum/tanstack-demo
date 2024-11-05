import { readFileSync } from 'fs'
import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    // Get search name from request body
    const { name } = await readBody(event)

    // Read existing todos
    const todosPath = './data/todos.json'
    let todos = []
    try {
      todos = JSON.parse(readFileSync(todosPath, 'utf-8'))
    } catch {
      // If file doesn't exist, return empty array
    }

    // Filter todos by name
    const filteredTodos = todos.filter((todo: any) => todo.text.toLowerCase().includes(name.toLowerCase()))

    return filteredTodos
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: error instanceof Error ? error.message : 'Failed to search todos'
    })
  }
})