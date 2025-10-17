/**
 * Export issues like:
 * gh issue list --repo trpc/trpc --json number,title,body,author > issues.json
 */

import fs from 'fs'
import path from 'path'

import { createDb } from '../libs/db/src/db/db.ts'
import { RawFeedbacks } from '../libs/db/src/db/schema.ts'

const issuesPath = path.join(__dirname, '../issues.json')
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

const PROJECT_ID = ''

async function loadIssues() {
  for (const issue of issues) {
    console.log(`Loading issue #${issue.number}: ${issue.title}`)
    await db.insert(RawFeedbacks).values({
      content: `# ${issue.title}\n\n${issue.body}`,
      projectId: PROJECT_ID,
      email: issue.author.login + '~users.github.com',
      // TODO: need a way to track external IDs like the github issue number against an integration
    })
  }
}

await loadIssues()
