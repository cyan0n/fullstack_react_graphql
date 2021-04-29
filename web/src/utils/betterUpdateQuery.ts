import { QueryInput, Cache } from "@urql/exchange-graphcache";

export function betterUpdateQuery<Result, Query>(
  cache: Cache,
  query_input: QueryInput,
  result: any,
  fn: (result: Result, query: Query) => Query
) {
  return cache.updateQuery(
    query_input,
    (data) => fn(result, data as any) as any
  );
}
