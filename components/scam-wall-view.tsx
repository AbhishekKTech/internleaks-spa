"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AnalysisDetail } from "@/components/analysis-detail"
import { AlertTriangle, Flame, CalendarDays, Loader2 } from "lucide-react"

interface BackendReport {
  id: number
  companyName?: string
  company?: { name: string } 
  scamType: string
  description: string
  createdAt: string
  riskPercentage?: number
  verdict?: string
  redFlags?: any // 🔥 FIX: Ab yeh Array ya String dono ho sakta hai
  companyWebsite?: string
  hrEmailDomain?: string
  paymentDemanded?: string
  interviewTaken?: string
}

interface ScamWallViewProps {
  reports: BackendReport[]
  isLoading?: boolean 
}

function getRiskStyle(scamType: string) {
  const safeScamType = scamType || ""

  if (safeScamType === "High Risk Fraud" || safeScamType.toLowerCase().includes("high")) {
    return {
      color: "text-[#ef4444]",
      border: "border-[#ef4444]/30",
      bg: "bg-[#ef4444]/10",
      hover: "hover:border-[#ef4444]/40 hover:shadow-[0_0_30px_-10px_#ef4444]",
      label: "High Risk"
    }
  }
  return {
    color: "text-amber-400",
    border: "border-amber-400/30",
    bg: "bg-amber-400/10",
    hover: "hover:border-amber-400/40 hover:shadow-[0_0_30px_-10px_#fbbf24]",
    label: "Suspicious"
  }
}

function formatDate(iso: string) {
  if (!iso) return "Unknown Date"
  const d = new Date(iso)
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function ScamWallView({ reports, isLoading = false }: ScamWallViewProps) {
  const [selected, setSelected] = useState<any | null>(null)

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Community Reported Scams
        </h2>
        <p className="mt-3 text-pretty text-white/55">
          Real fake-offer reports flagged by our AI and the INTERNLEAKS
          community. Identities are always hidden.
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
           <Loader2 className="h-10 w-10 animate-spin text-[#8b5cf6]" />
           <p className="text-white/60">Fetching latest scam reports from database...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] rounded-2xl border border-dashed border-white/10 bg-white/5">
           <AlertTriangle className="mb-4 h-12 w-12 text-white/20" />
           <h3 className="text-xl font-bold text-white/80">No Scams Reported Yet</h3>
           <p className="text-white/50">Be the first to report a suspicious internship offer.</p>
        </div>
      ) : (
        
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => {
            const style = getRiskStyle(report.scamType)

            // 🔥 CRASH FIX: Smart Logic jo Array aur String dono ko bina crash hue handle karega
            let redFlagsArray: string[] = [];
            if (Array.isArray(report.redFlags)) {
              redFlagsArray = report.redFlags; // Submit karte time yeh chalega
            } else if (typeof report.redFlags === "string" && report.redFlags.trim() !== "") {
              redFlagsArray = report.redFlags.split(" | "); // Refresh (DB load) ke time yeh chalega
            }

            const displayCompanyName = report.company?.name || report.companyName || "Unknown Company"
            const displayVerdict = report.verdict || report.description || "No description available"
            const displayRisk = report.riskPercentage || (report.scamType === "High Risk Fraud" ? 95 : 65)

            return (
              <button
                key={report.id}
                onClick={() => setSelected({
                  ...report, 
                  companyName: displayCompanyName,
                  verdict: displayVerdict, 
                  redFlags: redFlagsArray,
                  riskPercentage: displayRisk,
                  // 🔥 MISSING DATA FIX: Modal context ke liye data
                  companyWebsite: report.companyWebsite || "Not provided",
                  hrEmailDomain: report.hrEmailDomain || "Not provided",
                  paymentDemanded: report.paymentDemanded || "Not disclosed",
                  interviewTaken: report.interviewTaken || "Not disclosed"
                })}
                // ... yahan se neeche ka <button> ka HTML design same rahega ...
                className={`group flex flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-5 text-left backdrop-blur-md transition-all hover:bg-white/[0.07] ${style.hover}`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border ${style.border} ${style.bg} px-2.5 py-1 text-xs font-semibold ${style.color}`}>
                      <AlertTriangle className="h-3 w-3" />
                      {style.label}
                    </span>
                    {/* Yahan Risk Score display ho raha hai */}
                    <span className="text-xs font-bold text-white/40 group-hover:text-white/70">
                      {displayRisk}% Risk
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-white truncate w-full">
                    {displayCompanyName}
                  </h3>
                  
                  <p className={`mt-1.5 text-sm leading-relaxed line-clamp-3 ${style.color}`}>
                    {displayVerdict}
                  </p>
                </div>

                <div className="mt-4 flex w-full items-center gap-1.5 border-t border-white/10 pt-3 text-xs text-white/40">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Reported {formatDate(report.createdAt)}
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* Detail modal */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-h-[88vh] overflow-y-auto border-white/10 bg-[#0B0F19] text-white sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">
              Full Risk Analysis
            </DialogTitle>
          </DialogHeader>
          {selected && <AnalysisDetail report={selected} compact />}
        </DialogContent>
      </Dialog>
    </section>
  )
}