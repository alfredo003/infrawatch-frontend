import * as React from "react"
import { CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

type InlineSuccessProps = {
  message?: string | null
  className?: string
}

export default function InlineSuccess({ message, className }: InlineSuccessProps) {
  if (!message) return null

  return (
    <div
      role="status"
      className={cn(
        "mt-3 bg-green-900/50 border border-green-600 rounded-lg p-3 flex items-start space-x-3",
        className
      )}
    >
      <CheckCircle className="w-5 h-5 text-green-300 mt-0.5 flex-shrink-0" />
      <div className="text-sm text-green-100 font-mono">{message}</div>
    </div>
  )
}
