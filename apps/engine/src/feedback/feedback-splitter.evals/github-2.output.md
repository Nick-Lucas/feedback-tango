On the vanilla client, being able to an `AsyncIterable<T>` from a subscription in order to make it compliant with the [`streamedQuery` from tansatck query](https://tanstack.com/query/latest/docs/reference/streamedQuery).

Currently `@trpc/tanstack-react-query` support for `useSubscriptions` but implementing the `AsyncIterable` on the vanilla client would provide the feature to vue user as well.

Implement the `client.myProcedure.subscribe().iterator(): Promise<AsyncIterable<T>>`
