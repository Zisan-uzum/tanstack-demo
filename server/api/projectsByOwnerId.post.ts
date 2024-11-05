import { readFileSync, existsSync } from 'fs'
import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    // Get ownerId from request body
    const { ownerId } = await readBody(event)

    // Set up path for projects data
    const projectsPath = './data/projects.json'
    
    // Check if the file exists
    if (!existsSync(projectsPath)) {
      return [] // Return empty array if file doesn't exist
    }

    // Read existing projects
    const projects = JSON.parse(readFileSync(projectsPath, 'utf-8'))

    // Filter projects by ownerId
    const filteredProjects = projects.filter((project: {
        ownerId: string,
        projectName: string
      }) => project.ownerId === ownerId)

    return filteredProjects
  } catch (error) {
    return [] // Return empty array on error
  }
})