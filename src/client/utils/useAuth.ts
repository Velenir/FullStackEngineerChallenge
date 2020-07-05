import { useRouter } from "next/router"
import { useEffect } from "react"
import { USER_ROLE } from "server/consts"
import { useMeQuery } from "generated/graphql"

export const useAuth = () => {
  const {data, loading, error} = useMeQuery()

  return {
    loading,
    isAuthed: !loading && data?.me,
    error,
    user: data?.me,
    isAdmin: data?.me?.role === USER_ROLE.ADMIN
  }
}

export const useRedirectIfNotAuth = (redirectUrl: string = '/') => {
  const router = useRouter()
  const {data, loading, error} = useMeQuery()
  
  const redirect = !loading && !data?.me

  useEffect(() => {
    if (redirect) router.replace(redirectUrl)
  }, [redirect])

  return {data, loading, error}
}