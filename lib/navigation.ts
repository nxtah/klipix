import { useRouter } from "next/navigation"
import { useLocale } from "next-intl"

export function useLocaleRouter() {
  const router = useRouter()
  const locale = useLocale()
  
  return {
    ...router,
    push: (path: string) => router.push(`/${locale}${path}`),
    replace: (path: string) => router.replace(`/${locale}${path}`),
  }
}

export function getLocalePath(path: string, locale: string) {
  return `/${locale}${path}`
}
