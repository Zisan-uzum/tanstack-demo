import { readFileSync, writeFileSync } from 'fs'
import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  // wait for 2 seconds
  await new Promise((resolve) => setTimeout(resolve, 5000))

  try {
    // Get todo from request body
    const { todo } = await readBody(event)

  
    // Read existing todos
    const todosPath = './data/todos.json'
    let todos = []
    try {
      todos = JSON.parse(readFileSync(todosPath, 'utf-8'))
    } catch {
      // If file doesn't exist, start with empty array
    }

    // Add new todo
    const newTodo = {
      id: Date.now(),
      text: todo,
      completed: false
    }
    todos.push(newTodo)

    // Save updated todos
    writeFileSync(todosPath, JSON.stringify(todos, null, 2))

    return newTodo
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: error instanceof Error ? error.message : 'Failed to create todo'
    })
  }
})
