import { defineConfig } from 'tsup'

export default defineConfig({
  noExternal: ['@inquirer/prompts'],
})
