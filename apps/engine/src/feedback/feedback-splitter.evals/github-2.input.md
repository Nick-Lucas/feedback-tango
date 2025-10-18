# feat: client subscriber gets an AsyncIterable

### Describe the feature you'd like to request

On the vanilla client, being able to an `AsyncIterable<T>` from a subscription in order to make it compliant with the [`streamedQuery` from tansatck query](https://tanstack.com/query/latest/docs/reference/streamedQuery).

Currently `@trpc/tanstack-react-query` support for `useSubscriptions` but implementing the `AsyncIterable` on the vanilla client would provide the feature to vue user as well.

### Describe the solution you'd like to see

Implement the `client.myProcedure.subscribe().iterator(): Promise<AsyncIterable<T>>`

### Describe alternate solutions

- https://reactivex.io/IxJS/functions/asynciterable.fromEventPattern.html

### Additional information

_No response_

### 👨‍👧‍👦 Contributing

- [x] 🙋‍♂️ Yes, I'd be down to file a PR implementing this feature!
