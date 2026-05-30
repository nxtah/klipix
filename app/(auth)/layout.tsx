import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Klipix — Auth",
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      {children}
    </div>
  )
}
