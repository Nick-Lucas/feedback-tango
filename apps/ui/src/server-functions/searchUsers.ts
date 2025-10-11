import { getDb } from './core'
import z from 'zod'
import { authedServerFn, authz } from './core'

export const searchUsers = authedServerFn()
  .inputValidator(
    z.object({
      query: z.string().min(1),
      projectId: z.string(),
    })
  )
  .handler(async (ctx) => {
    await authz.checkProjectAccessAndThrow(
      ctx.context.user.id,
      ctx.data.projectId
    )

    const results = await getDb().query.user.findMany({
      columns: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
      where(fields, operators) {
        return operators.like(fields.email, `%${ctx.data.query}%`)
      },
      limit: 10,
    })

    return results
  })
