The middlewares can currently extend/overwrite the context. They can technically modify the input with `return next({ input: newInput })` in the same manner, but that's not reflected in types in the downstream procedures.

I would like the input type change to be reflected in types, the same way as it happens with the context.

Currently, this is not possible (it works in runtime, but it leads to type errors). As such, currently user can not really alter the input alongside the middleware chain; they must always deal with all input fields.

I would like the `editAccount` input to properly infer its new shape as coming from the upstream middleware.
