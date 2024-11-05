import { readFileSync, existsSync } from 'fs'
import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    // Set up path for projects data
    const projectsPath = './data/projects.json'
    
    // Check if the file exists
    if (!existsSync(projectsPath)) {
      return [] // Return empty array if file doesn't exist
    }

    // Read existing projects
    const projects = JSON.parse(readFileSync(projectsPath, 'utf-8'))
    return projects
  } catch (error) {
    return [] // Return empty array on error
  }
})