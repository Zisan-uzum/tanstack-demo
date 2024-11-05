import { readFileSync, writeFileSync } from 'fs'
import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    // Get person data from request body
    const { name } = await readBody(event)

    // Read existing people
    const peoplePath = './data/people.json'
    let people = []
    try {
      people = JSON.parse(readFileSync(peoplePath, 'utf-8'))
    } catch {
      // If file doesn't exist, start with empty array
    }

    // Add new person
    const newPerson = {
      id: `${Date.now()}-${name}`,
      name: name
    }
    people.push(newPerson)

    // Save updated people
    writeFileSync(peoplePath, JSON.stringify(people, null, 2))

    return newPerson
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: error instanceof Error ? error.message : 'Failed to create person'
    })
  }
})