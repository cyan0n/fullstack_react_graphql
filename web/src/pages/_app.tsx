import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import { Provider, createClient, fetchExchange, dedupExchange } from "urql";
import { cacheExchange, QueryInput, Cache } from "@urql/exchange-graphcache";
import {
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
} from "../generated/graphql";

import theme from "../theme";

function betterUpdateQuery<Result, Query>(
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

const client = createClient({
  url: "http://localhost:4000/graphql",
  fetchOptions: { credentials: "include" },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          login: (_result, args, cache, info) => {
            betterUpdateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.login.errors) {
                  return query;
                }
                return {
                  me: result.login.user,
                };
              }
            );
          },
          logout: (_result, args, cache, info) => {
            betterUpdateQuery<LogoutMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              () => ({ me: null })
            );
          },
          register: (_result, args, cache, info) => {
            betterUpdateQuery<RegisterMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.register.errors) {
                  return query;
                }
                return {
                  me: result.register.user,
                };
              }
            );
          },
        },
      },
    }),
    fetchExchange,
  ],
});

function App({ Component, pageProps }: any) {
  return (
    <Provider value={client}>
      <ChakraProvider resetCSS theme={theme}>
        <ColorModeProvider
          options={{
            initialColorMode: "dark",
            useSystemColorMode: false,
          }}
        >
          <Component {...pageProps} />
        </ColorModeProvider>
      </ChakraProvider>
    </Provider>
  );
}

export default App;
