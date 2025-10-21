# feat: extending procedurebuilder with named functions

### Describe the feature you'd like to request

i'm building a few middlewares and the `.use(factory(params))` starts to feel a bit too generic - it's a chain of `.use().use().use().use().use().use().use().use()` before going somewhere meaningful just for the sake of composability.

i know i could build bigger middlewares or stronger base procedure but i'd loose the composability part ; also it doesn't address the spam of `.use` keyword where i'm sure "procedure extensions" could be a nice to have.

wouldn't it that this:

```ts
procedure
  .use(doSomething)
  .use(andSomething('foo'))
  .input()
  .query()
```

would be nicer like this:

```ts
procedure
  .doSomething()
  .andSomething('foo')
  .input()
  .query()
```

?

### Describe the solution you'd like to see

i'd like the ability to be able to merge new function names as aliased middleware usage. for the api, it's a bit difficult to know what to expect, but maybe something like:

```ts
const procedure = extendProcedure(t.procedure, {
  doSomething(param: string) {
    return this.use(doSomething(param))
  }
})
```

i'm thinking that functions such as `input`, `query` etc could eventually be implemented this way too.

### Describe alternate solutions

i made a semi-working workaround. it does work when importing the procedure and using it to build an endpoint directly but it won't work when extending the procedure as base of another one (and i have no clue why).

```ts
const procedure = t.procedure

export const baseProcedure {
  ...procedure,

  load<T extends Record<string, { new(): any }>>(this: typeof procedure, services: T) {
    return this.use(load(services))
  },
}
```

with middleware defined as:

```ts
import { middleware } from '../trpc'

export function load<T extends Record<string, { new(): any }>>(services: T) {
  return middleware(async ({ ctx, next }) => {
    const resolved = Object.fromEntries(
      Object.entries(services)
        .filter(([key, val]) => !(key in ctx && ctx[key] instanceof val))
        .map(([key, cls]) => [key, new cls()])
    )

    return next({
      ctx: {
        ...ctx,
        ...resolved,
      },
    })
  })
}
```

working usage:

```ts
router({
  getFoo: baseProcedure
    .load({ foo: Foo })
    .query(({ ctx }) => ctx.foo.getFoo())
})
```

broken usage:

```ts
const extendedProcedure = baseProcedure
  .load({ foo: Foo })
  .use(async ({ ctx, next }) => next({ ctx }))

router({
  getFoo: extendedProcedure
    .load({ bar: Bar }) // ← does not exist anymore
    .query(({ ctx }) => ctx.foo.getFoo())
})
```

### Additional information

I've no clue how to implement this but it looks fun to do.

### 👨‍👧‍👦 Contributing

- [x] 🙋‍♂️ Yes, I'd be down to file a PR implementing this feature!
