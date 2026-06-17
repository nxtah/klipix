import { Sparkles } from "lucide-react"

export function AiLoadingOverlay({ message = "Generating..." }: { message?: string }) {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-accent/40 bg-background/80 backdrop-blur-sm">
      <span className="ai-pulse-ring inline-flex size-16 items-center justify-center rounded-2xl border-2 border-accent bg-accent/10 shadow-neo-xs">
        <Sparkles className="ai-wiggle h-8 w-8 text-accent" />
      </span>
      <div className="flex flex-col items-center gap-2">
        <p className="text-sm font-heading font-semibold text-foreground">
          {message}
        </p>
        <div className="flex items-center gap-1">
          <span className="ai-dot inline-block size-1.5 rounded-full bg-accent" />
          <span className="ai-dot inline-block size-1.5 rounded-full bg-accent" />
          <span className="ai-dot inline-block size-1.5 rounded-full bg-accent" />
        </div>
      </div>
    </div>
  )
}
