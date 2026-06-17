import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Klipix — Auth",
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="landing-bg relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="landing-dots" />
      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
