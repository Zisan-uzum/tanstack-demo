import { readFileSync, existsSync } from 'fs'
import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    // Get the name to filter from the request body
    const { name } = await readBody(event)

    // Set up path for people data
    const peoplePath = './data/people.json'
    
    // Check if the file exists
    if (!existsSync(peoplePath)) {
      return [] // Return empty array if file doesn't exist
    }

    // Read existing people
    const people = JSON.parse(readFileSync(peoplePath, 'utf-8'))

    // Filter people by name
    const person = people.find((person: { name: string, id: string }) => person.name.toLowerCase().includes(name.toLowerCase()))

    return person.id;
  } catch (error) {
    return [] // Return empty array on error
  }
})