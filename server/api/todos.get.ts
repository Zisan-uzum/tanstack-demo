import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { defineEventHandler } from 'h3'
import { dirname } from 'path'

export default defineEventHandler(async (event) => {
  // WAIT FOR 5 SEC
  try {
    // Set up path and ensure directory exists
    const todosPath = './data/todos.json'
    const dirPath = dirname(todosPath)
    
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true })
    }
    
    let todos = []
    try {
      todos = JSON.parse(readFileSync(todosPath, 'utf-8'))
    } catch {
      // Create empty todos file if it doesn't exist
      writeFileSync(todosPath, JSON.stringify([], null, 2))
    }
    
    return todos
  } catch (error) {
    return []
  }
})
