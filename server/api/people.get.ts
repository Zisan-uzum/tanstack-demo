import { readFileSync, existsSync } from 'fs'
import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    // Set up path for people data
    const peoplePath = './data/people.json'
    
    // Check if the file exists
    if (!existsSync(peoplePath)) {
      return [] // Return empty array if file doesn't exist
    }

    // Read existing people
    const people = JSON.parse(readFileSync(peoplePath, 'utf-8'))
    return people
  } catch (error) {
    return [] // Return empty array on error
  }
})