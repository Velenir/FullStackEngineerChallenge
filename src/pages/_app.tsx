
import { ApolloProvider } from '@apollo/react-hooks'
import { AppProps } from 'next/app'
import {useState, useEffect} from 'react'
import { setAccessToken } from 'client/utils/accessToken'
import { useApollo } from 'client/apollo'


export default function App({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/refresh_token', {
      method: 'POST',
      credentials: 'include'
    }).then(async res => {
      const { accessToken } = await res.json()

      setAccessToken(accessToken)
      setLoading(false)
    }).catch(error => {
      console.error(error)
      setLoading(false)
    })
  }, [])

  console.log('pageProps', pageProps);
  const apolloClient = useApollo(pageProps.initialApolloState)

  if (loading) return null

  return (
    <ApolloProvider client={apolloClient} >
      <Component {...pageProps} />
    </ApolloProvider>
  )
}
