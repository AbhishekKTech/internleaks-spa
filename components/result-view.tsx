"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { AnalysisDetail } from "@/components/analysis-detail"
import { AlertOctagon, Download, RotateCcw, CheckCircle2 } from "lucide-react"
import type { ScamReport } from "@/lib/internleaks-data"
import jsPDF from "jspdf"

interface ResultViewProps {
  report: ScamReport
  onReport: (report: ScamReport) => void
  onScanAnother: () => void
  isValidDocument?: boolean
}

export function ResultView({
  report,
  onReport,
  onScanAnother,
  isValidDocument = true,
}: ResultViewProps) {
  const [confirmed, setConfirmed] = useState(false)
  const [reported, setReported] = useState(false)

  const handleReport = () => {
    onReport(report)
    setReported(true)
  }

  // 👉 NAYA FIX: Remove Emojis and unsupported characters so jsPDF doesn't crash
  const sanitizeText = (str: string) => {
    if (!str) return ""
    // Only allow standard ASCII characters (removes emojis and weird symbols)
    return str.replace(/[^\x20-\x7E\n]/g, "")
  }

  const handleDownload = () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()

    // 🎨 1. HEADER (BRANDING)
    doc.setFillColor(11, 15, 25)
    doc.rect(0, 0, pageWidth, 40, "F")

    doc.setTextColor(168, 85, 247)
    doc.setFontSize(24)
    doc.setFont("helvetica", "bold")
    doc.text("INTERNLEAKS", 14, 20)

    doc.setTextColor(200, 200, 200)
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text("Automated AI Threat & Fraud Analysis Report", 14, 28)
    doc.text(`Report ID: ILX-${report.id} | Date: ${new Date().toLocaleDateString()}`, 14, 34)

    // 📋 2. COMPANY CONTEXT SECTION
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Target Entity Details", 14, 52)

    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")
    doc.text(`Company Name: ${sanitizeText(report.companyName)}`, 14, 62)
    doc.text(`Website/Domain: ${sanitizeText(report.companyWebsite || "Not Provided")}`, 14, 70)
    doc.text(`HR Email Domain: ${sanitizeText(report.hrEmailDomain || "Not Provided")}`, 14, 78)
    doc.text(`Payment Demanded: ${sanitizeText(report.paymentDemanded)}`, 14, 86)
    doc.text(`Interview Taken: ${sanitizeText(report.interviewTaken)}`, 14, 94)

    // ⚠️ 3. AI VERDICT & RISK SCORE
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("AI Investigation Result", 14, 110)

    if (report.riskPercentage > 75) doc.setTextColor(220, 38, 38)
    else if (report.riskPercentage > 40) doc.setTextColor(234, 179, 8)
    else doc.setTextColor(34, 197, 94)

    doc.setFontSize(16)
    doc.text(`Risk Score: ${report.riskPercentage}%`, 14, 120)
    
    doc.setFontSize(11)
    const splitVerdict = doc.splitTextToSize(`Verdict: ${sanitizeText(report.verdict)}`, pageWidth - 28)
    doc.text(splitVerdict, 14, 128)

    const verdictHeight = splitVerdict.length * 5

    // 🚩 4. RED FLAGS SECTION
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    let yPosition = 128 + verdictHeight + 10
    doc.text("Detected Anomalies & Red Flags", 14, yPosition)

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    yPosition += 10
    
    report.redFlags.forEach((flag, index) => {
      // Har string ko sanitize kar rahe hain taaki emoji pdf na tode
      const cleanFlag = sanitizeText(flag)
      const splitText = doc.splitTextToSize(`${index + 1}. ${cleanFlag}`, pageWidth - 28)
      
      if (yPosition + splitText.length * 5 > 230) {
         doc.addPage()
         yPosition = 20
      }
      
      doc.text(splitText, 14, yPosition)
      yPosition += splitText.length * 5 + 4
    })

    // ⚖️ 5. STRICT LEGAL DISCLAIMER
    if (yPosition > 230) {
        doc.addPage()
        yPosition = 20
    }

    doc.setFillColor(245, 245, 245)
    doc.rect(10, yPosition + 10, pageWidth - 20, 45, "F")

    doc.setTextColor(100, 100, 100)
    doc.setFontSize(9)
    doc.setFont("helvetica", "bold")
    doc.text("LEGAL DISCLAIMER & TERMS OF USE", 14, yPosition + 18)

    doc.setFontSize(8)
    doc.setFont("helvetica", "normal")
    const legalText = "This report was generated autonomously by an Artificial Intelligence system based on user-provided inputs and public web data aggregation. It DOES NOT constitute legal, financial, or professional advice. Internleaks acts solely as a technological tool and assumes no liability for the accuracy of this data or any actions/decisions taken based on this report. This document is for personal educational purposes and fraud-prevention awareness only. The opinions generated do not reflect the official stance of Internleaks or its creators."
    
    const splitLegal = doc.splitTextToSize(legalText, pageWidth - 28)
    doc.text(splitLegal, 14, yPosition + 24)

    doc.save(`Internleaks_Report_${sanitizeText(report.companyName).replace(/\s+/g, "_")}.pdf`)
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-12">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md sm:p-8">
        <p className="mb-6 text-xs font-semibold uppercase tracking-wider text-[#8b5cf6]">
          AI Risk Profile
        </p>

        <AnalysisDetail report={report} />

        {!isValidDocument ? (
          <div className="mt-8 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-center backdrop-blur-sm">
            <p className="text-sm font-semibold text-amber-400">⚠️ Invalid Document Detected</p>
            <p className="mt-1 text-sm text-white/70">This does not appear to be a valid offer letter or HR email. Reporting to the Scam Wall has been disabled to maintain community data quality.</p>
          </div>
        ) : (
          <label className="mt-8 flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
            <Checkbox
              checked={confirmed}
              onCheckedChange={(c) => setConfirmed(c === true)}
              className="mt-0.5 border-white/30 data-[state=checked]:border-[#8b5cf6] data-[state=checked]:bg-[#8b5cf6]"
            />
            <span className="text-sm leading-relaxed text-white/70">
              I confirm this is my document. I understand my identity will remain 100% hidden on the public Scam Wall.
            </span>
          </label>
        )}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={handleReport}
            disabled={!confirmed || reported || !isValidDocument} 
            size="lg"
            className="h-12 flex-1 rounded-xl bg-[#ef4444] text-base font-semibold text-white shadow-[0_0_30px_-6px_#ef4444] hover:bg-[#dc2626] disabled:opacity-40 disabled:shadow-none"
          >
            {reported ? (
              <>
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Reported to Scam Wall
              </>
            ) : (
              <>
                <AlertOctagon className="mr-2 h-5 w-5" />
                Report to Scam Wall
              </>
            )}
          </Button>
          <Button
            onClick={handleDownload}
            size="lg"
            variant="outline"
            className="h-12 flex-1 rounded-xl border-white/15 bg-white/5 text-base font-semibold text-white hover:bg-white/10 hover:text-white"
          >
            <Download className="mr-2 h-5 w-5" />
            Download Full Report PDF
          </Button>
        </div>

        <button
          onClick={onScanAnother}
          className="mt-5 flex w-full items-center justify-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
        >
          <RotateCcw className="h-4 w-4" />
          Scan Another Document
        </button>
      </div>
    </section>
  )
}