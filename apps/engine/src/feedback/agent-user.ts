import { db } from '../app.ts'
import { auth } from '@feedback-thing/db/auth'
import { randomUUID } from 'node:crypto'

export async function findAgentUser() {
  const agentUserEmail = 'agent@nicklucas.dev'
  const user = await db.query.user.findFirst({
    columns: { id: true },
    where: (users, { eq }) => eq(users.email, agentUserEmail),
  })

  if (user) {
    return user.id
  }

  const createResult = await auth.api.createUser({
    body: {
      email: 'agent@nicklucas.dev',
      name: 'AI Agent',
      password: randomUUID(),
    },
  })

  return createResult.user.id
}
