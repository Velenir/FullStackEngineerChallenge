// copy-pasta from https://github.com/vercel/next.js/blob/canary/examples/with-apollo-and-redux
// made as such to cache ApolloClient clien-side
// and recreate server-side (in getStatic|ServerSideProps for SSR, SSG)

import { useMemo } from 'react';
import { getAccessToken, setAccessToken } from './utils/accessToken';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink, Observable } from 'apollo-link';
import { TokenRefreshLink } from 'apollo-link-token-refresh';
import jwtDecode from 'jwt-decode';

let apolloClient: ApolloClient<unknown>;

function createApolloClient() {
  const cache = new InMemoryCache({});

  const requestLink = new ApolloLink(
    (operation, forward) =>
      new Observable((observer) => {
        let handle: any;
        Promise.resolve(operation)
          .then((operation) => {
            const accessToken = getAccessToken();
            if (accessToken) {
              operation.setContext({
                headers: {
                  authorization: `bearer ${accessToken}`, // incuded on every GQL request
                },
              });
            }
          })
          .then(() => {
            handle = forward(operation).subscribe({
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer),
            });
          })
          .catch(observer.error.bind(observer));

        return () => {
          if (handle) handle.unsubscribe();
        };
      })
  );

  //  requests a new accessToken when old one expires
  // relies on refreshToken included in a cookie
  const tokenRefreshLink = new TokenRefreshLink({
    accessTokenField: 'accessToken',
    isTokenValidOrUndefined: () => {
      const token = getAccessToken();

      if (!token) {
        return true;
      }

      try {
        const { exp } = jwtDecode(token);
        if (Date.now() >= exp * 1000) {
          return false; // expired
        } else {
          return true; // good for now
        }
      } catch {
        return false;
      }
    },
    fetchAccessToken: () => {
      return fetch('/api/refresh_token', {
        method: 'POST',
        credentials: 'include',
      }); // will return a new accessToken if given refreshToken in a cookie
    },
    handleFetch: (accessToken: string) => {
      setAccessToken(accessToken);
    },
    handleError: (err: Error) => {
      console.warn('Your refresh token is invalid. Try to relogin');
      console.error(err);
    },
  });

  const client = new ApolloClient({
    link: ApolloLink.from([
      tokenRefreshLink as any,
      onError(({ graphQLErrors, networkError }) => {
        graphQLErrors && console.log(graphQLErrors);
        networkError && console.log(networkError);
      }),
      requestLink,
      new HttpLink({
        uri: '/api/graphql',
        credentials: 'include',
      }),
    ]),
    cache,
    //  some reasonable defaults for ease of development
    // an improvement would be to setup better caching policy
    // with help of getServerSideProps for cache hydration
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all',
      },
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
  });

  return client;
}

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // get hydrated here
  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

// initialState can come from getServerSideProps
export function useApollo(initialState: any) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
