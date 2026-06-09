"use client"

import { useLocale } from "next-intl"
import { useTransition, useState } from "react"

import { Button } from "@/components/ui/button"
import { usePathname, useRouter } from "@/lib/i18n-navigation"

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "id", label: "Bahasa", flag: "🇮🇩" },
]

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState(false)

  const currentLanguage = LANGUAGES.find((lang) => lang.code === locale)

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === locale) return

    startTransition(() => {
      setIsOpen(false)

      if (newLocale === "en") {
        router.push(pathname)
      } else {
        router.push(`/${newLocale}${pathname}`)
      }
    })
  }

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="sm" 
        className="gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg">{currentLanguage?.flag}</span>
        <span className="hidden sm:inline text-sm">{currentLanguage?.code.toUpperCase()}</span>
      </Button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-card border-2 border-border rounded-2xl shadow-neo p-2 z-50">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              disabled={isPending || lang.code === locale}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-xl hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="text-lg">{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
