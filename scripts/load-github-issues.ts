/**
 * Export issues like:
 * gh issue list --repo trpc/trpc --json number,title,body,author > issues.json
 */

import fs from 'fs'
import path from 'path'

import { createDb } from '../libs/db/src/db/db.ts'
import { RawFeedbacks } from '../libs/db/src/db/schema.ts'
import { config } from 'dotenv'

config({
  path: '.env',
})

const issuesPath = path.join(
  import.meta.dirname,
  '../.backups/trpc-issues.json'
)
const issuesJson = fs.readFileSync(issuesPath, 'utf-8')
const issues = JSON.parse(issuesJson) as Array<{
  number: number
  title: string
  body: string
  author: {
    id: string
    login: string
    name: string
  }
}>

const db = createDb()

const PROJECT_ID = '0199dfc9-d041-73b5-8c1b-df043cf368b6'

async function loadIssues() {
  await db.transaction(async (tx) => {
    for (const issue of issues) {
      console.log(`Loading issue #${issue.number}: ${issue.title}`)
      await tx.insert(RawFeedbacks).values({
        content: `# ${issue.title}\n\n${issue.body}`,
        projectId: PROJECT_ID,
        email: issue.author.login + '~users.github.com',
        // TODO: need a way to track external IDs like the github issue number against an integration
      })
    }
  })
}

await loadIssues()

await db.$client.end()
console.log('Done loading issues.')
