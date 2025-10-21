The middlewares can currently extend/overwrite the context. They can technically modify the input with `return next({ input: newInput })` in the same manner, but that's not reflected in types in the downstream procedures. I would like the input type change to be reflected in types, the same way as it happens with the context. Consider the example:

```ts
const orgProcedure = procedure
  .input(
    v.object({
      orgId: v.pipe(v.string(), v.uuid()),
      orgAccessKey: v.string(), // Imaginary data
    })
  )
  .use(async ({ input: { orgId, orgAccessKey, ...input }, next }) => {
    const org = await db.org
      .findOptional(orgId)
      .select('id', 'name')
      .where({ orgAccessKey }) // Imaginary access check
    assertHttp404NotFound(org, 'Org not found')
    return next({
      ctx: { org }, // Add org object to context
      input, // Remove orgId and orgAccessKey from input
    })
  })

const editAccount = orgProcedure
  .input(
    v.object({
      accountId: v.pipe(v.string(), v.uuid()),
      name: v.string(),
      balance: v.number(),
    })
  )
  .mutation(async ({ ctx: { org }, input: { accountId, ...input } }) => {
    // Here input is { name, balance } in runtime,
    // but it's typed as { orgId, orgAccessKey, name, balance }.
    //
    // The query builder errors because of the extra fields in the type.
    await db.account.find(accountId).where({ orgId: org.id }).update(input)
  })
``` 

Currently, doing the above is not possible (it works in runtime, but it leads to type errors). As such, currently user can not really alter the input alongside the middleware chain; they must always deal with all input fields. In the example above, I would like the `editAccount` input to properly infer its new shape as coming from the upstream middleware.
