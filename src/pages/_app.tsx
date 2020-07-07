import { ApolloProvider } from '@apollo/react-hooks';
import { AppProps } from 'next/app';
import { useState, useEffect } from 'react';
import { setAccessToken } from 'client/utils/accessToken';
import { useApollo } from 'client/apollo';

export default function App({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch('/api/refresh_token', {
      method: 'POST',
      credentials: 'include',
    })
      .then(async (res) => {
        const { accessToken } = await res.json();
        if (!mounted) return;

        setAccessToken(accessToken);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const apolloClient = useApollo(pageProps.initialApolloState);

  if (loading) return null;

  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
      <style global jsx>{`
        *,
        ::after,
        ::before {
          box-sizing: border-box;
        }
      `}</style>
    </ApolloProvider>
  );
}
