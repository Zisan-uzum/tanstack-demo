import { readFileSync, writeFileSync } from 'fs'
import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    // Get project data from request body
    const { ownerId, projectName } = await readBody(event)

    console.log("backend owner id", ownerId, "project name", projectName)
    // Read existing projects
    const projectsPath = './data/projects.json'
    let projects = []
    try {
      projects = JSON.parse(readFileSync(projectsPath, 'utf-8'))
    } catch {
      // If file doesn't exist, start with empty array
    }

    // Add new project
    const newProject = {
      ownerId: ownerId,
      name: projectName
    }
    projects.push(newProject)

    // Save updated projects
    writeFileSync(projectsPath, JSON.stringify(projects, null, 2))

    return newProject
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: error instanceof Error ? error.message : 'Failed to create project'
    })
  }
})