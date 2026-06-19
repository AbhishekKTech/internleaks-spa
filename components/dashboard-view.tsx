"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Trash2, ShieldAlert, Loader2, Sparkles, FileText } from "lucide-react"

interface DashboardViewProps {
  userEmail: string
  userName?: string
  credits: number
  onNavigateBack: () => void
  onReportDeleted?: (id: number) => void 
}

export function DashboardView({ userEmail, userName, credits, onNavigateBack, onReportDeleted }: DashboardViewProps) {
  const [reports, setReports] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const displayName = userName || userEmail.split("@")[0] || "User"

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("internleaks_token");
      const config = {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      };

      // Ab sirf Reports fetch kar rahe hain
      const reportsRes = await axios.get(`http://localhost:8080/api/v1/reports/user/${userEmail}`, config)
      
      // Nayi reports pehle dikhane ke liye sort kar diya
      const sortedReports = reportsRes.data.sort((a: any, b: any) => b.id - a.id);
      setReports(sortedReports)
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (userEmail) {
      fetchData()
    }
  }, [userEmail])

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this scam report? It will be removed from the public Scam Wall as well.")) return;

    const token = localStorage.getItem("internleaks_token");
    const config = {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    };

    try {
      // Backend se direct delete
      await axios.delete(`http://localhost:8080/api/v1/reports/${id}`, config)
      
      // UI se turant hata do
      setReports(reports.filter(item => item.id !== id))
      
      // Parent (page.tsx) ko update kar do taaki Public Wall se bhi hat jaye
      if (onReportDeleted) {
        onReportDeleted(id)
      }
    } catch (error) {
      console.error("Delete failed:", error)
      alert("Failed to delete. Please try again.")
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Header Section */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Welcome back, <span className="text-[#8b5cf6]">{displayName}</span>! 👋
          </h1>
          <p className="mt-2 text-white/60">Manage your submitted scam reports and credits.</p>
        </div>
        <button
          onClick={onNavigateBack}
          className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
        >
          Go to Scanner
        </button>
      </div>

      {/* Simplified Stat Cards (2 Columns instead of 3) */}
      <div className="mb-10 grid gap-4 sm:grid-cols-2">
        <div className="relative overflow-hidden rounded-2xl border border-[#8b5cf6]/20 bg-gradient-to-br from-[#8b5cf6]/10 to-transparent p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#8b5cf6]/20 text-[#8b5cf6]">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/60">Available Credits</p>
              <h3 className="text-2xl font-bold text-white">{credits}</h3>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-400">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/60">Scam Reports Submitted</p>
              <h3 className="text-2xl font-bold text-white">{reports.length}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
        <FileText className="h-5 w-5 text-[#8b5cf6]" />
        <h2 className="text-xl font-bold text-white">My Submitted Reports</h2>
      </div>

      {/* Main Content Area - Just Cards Now */}
      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-4 rounded-2xl border border-white/10 bg-[#0B0F19]">
            <Loader2 className="h-8 w-8 animate-spin text-[#8b5cf6]" />
            <p className="text-sm text-white/50">Fetching your submitted reports...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5">
            <FileText className="mb-2 h-10 w-10 text-white/20" />
            <p className="text-lg font-medium text-white/80">No reports submitted</p>
            <p className="mt-1 text-sm text-white/50">You haven't reported any scams to the community yet.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {reports.map((report) => (
              <div key={report.id} className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0B0F19] p-5 shadow-lg transition-all hover:border-red-500/30 hover:shadow-red-500/5">
                <div>
                  <div className="mb-4 flex items-start justify-between">
                    <h3 className="font-bold text-lg text-white truncate pr-2">
                      {report.company?.name || report.companyName || "Unknown Company"}
                    </h3>
                    <button 
                      onClick={() => handleDelete(report.id)}
                      className="rounded-lg bg-red-500/10 p-2 text-red-400 transition-colors hover:bg-red-500/20"
                      title="Delete this report permanently"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-400 border border-red-500/20">
                    <ShieldAlert className="h-3 w-3"/> {report.scamType || "Suspicious"}
                  </span>
                  
                  <p className="text-sm leading-relaxed text-white/70 mt-2">
                    {report.description}
                  </p>
                </div>
                <div className="mt-5 border-t border-white/10 pt-4 text-xs font-medium text-white/40">
                  Reported on: {new Date(report.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}