"use client"

import { useEffect, useState } from "react"
import { Radar } from "lucide-react"

interface AnalyzingViewProps {
  onComplete: () => void
}

const STATUS_MESSAGES = [
  "Extracting text and document metadata...",
  "Redacting Personally Identifiable Information (PII)...",
  "Cross-referencing HR domains with threat databases...",
  "Analyzing semantic patterns for advance-fee fraud...",
  "Compiling final risk profile...",
]

export function AnalyzingView({ onComplete }: AnalyzingViewProps) {
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(true)

  // transition to the result view after the heavy "processing" window
  useEffect(() => {
    const timer = setTimeout(onComplete, 5000)
    return () => clearTimeout(timer)
  }, [onComplete])

  // cycle status messages with a fade-out / fade-in between each
  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      const swap = setTimeout(() => {
        setStep((s) => (s + 1) % STATUS_MESSAGES.length)
        setVisible(true)
      }, 200)
      return () => clearTimeout(swap)
    }, 850)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      {/* Radar scanner */}
      <div className="relative flex h-64 w-64 items-center justify-center">
        {/* expanding sonar rings */}
        <span className="absolute inset-0 rounded-full border border-[#8b5cf6]/40 animate-radar-pulse" />
        <span
          className="absolute inset-0 rounded-full border border-[#8b5cf6]/40 animate-radar-pulse"
          style={{ animationDelay: "0.6s" }}
        />
        <span
          className="absolute inset-0 rounded-full border border-[#8b5cf6]/40 animate-radar-pulse"
          style={{ animationDelay: "1.2s" }}
        />

        {/* slow counter-rotating outer ring */}
        <div
          className="absolute inset-2 rounded-full border-2 border-dashed border-[#8b5cf6]/25 animate-spin"
          style={{ animationDuration: "9s", animationDirection: "reverse" }}
        />

        {/* fast spinning outer ring with a bright arc */}
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent animate-spin"
          style={{
            animationDuration: "4s",
            borderTopColor: "#8b5cf6",
            borderRightColor: "rgba(139,92,246,0.35)",
          }}
        />

        {/* radar dial */}
        <div className="relative flex h-44 w-44 items-center justify-center rounded-full border border-[#8b5cf6]/30 bg-[#8b5cf6]/5 backdrop-blur-md">
          {/* grid lines */}
          <div className="absolute h-px w-full bg-[#8b5cf6]/20" />
          <div className="absolute h-full w-px bg-[#8b5cf6]/20" />
          <div className="absolute h-24 w-24 rounded-full border border-[#8b5cf6]/15" />
          <div className="absolute h-12 w-12 rounded-full border border-[#8b5cf6]/15" />

          {/* sweeping radar beam */}
          <div className="absolute inset-0 animate-radar-spin rounded-full [background:conic-gradient(from_0deg,transparent_0deg,transparent_290deg,#8b5cf655_330deg,#8b5cf6cc_360deg)]" />

          {/* core */}
          <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#0B0F19] ring-1 ring-[#8b5cf6]/40 animate-glow-pulse">
            <Radar
              className="h-8 w-8 animate-spin text-[#8b5cf6]"
              style={{ animationDuration: "3s" }}
            />
          </span>
        </div>
      </div>

      <h2 className="mt-10 text-2xl font-bold text-white">
        AI is deep-scanning the offer letter…
      </h2>

      {/* dynamic status sequence */}
      <p
        className="mt-3 h-6 max-w-md text-pretty text-sm font-medium leading-relaxed text-[#8b5cf6] transition-opacity duration-200"
        style={{ opacity: visible ? 1 : 0 }}
        aria-live="polite"
      >
        {STATUS_MESSAGES[step]}
      </p>
    </section>
  )
}
