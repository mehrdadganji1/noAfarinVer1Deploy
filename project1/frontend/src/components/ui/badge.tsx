import * as React from "react"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline"
}

function Badge({ className = "", variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-primary text-white",
    secondary: "bg-gray-200 text-gray-800",
    destructive: "bg-red-500 text-white",
    outline: "border border-gray-300 text-gray-700",
  }

  return (
    <div
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${variants[variant]} ${className}`}
      {...props}
    />
  )
}

export { Badge }
