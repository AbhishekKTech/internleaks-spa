"use client"

import { AdminView } from "@/components/admin-view"
import { useState, useEffect } from "react"
import axios from "axios"
import { Navbar } from "@/components/navbar"
import { LandingView } from "@/components/landing-view"
import { WizardView } from "@/components/wizard-view"
import { AnalyzingView } from "@/components/analyzing-view"
import { ResultView } from "@/components/result-view"
import { ScamWallView } from "@/components/scam-wall-view"
import { AuthModal } from "@/components/auth-modal"
import { EditProfileModal } from "@/components/edit-profile-modal"
import { Footer } from "@/components/footer"
import { DashboardView } from "@/components/dashboard-view"
import {
  dummyScamWall,
  emptyWizardInput,
  type ScamReport,
  type WizardInput,
} from "@/lib/internleaks-data"

type View = "landing" | "wizard" | "analyzing" | "result" | "wall" | "dashboard" | "admin"

export default function Page() {
  const [editProfileOpen, setEditProfileOpen] = useState(false)
  const [view, setView] = useState<View>("landing")
  const [credits, setCredits] = useState(2)
  const [authOpen, setAuthOpen] = useState(false)
  const [wizard, setWizard] = useState<WizardInput>(emptyWizardInput)
  const [currentReport, setCurrentReport] = useState<ScamReport | null>(null)

  const [reports, setReports] = useState<ScamReport[]>([])
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isValidDoc, setIsValidDoc] = useState<boolean>(true)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

  const [userEmail, setUserEmail] = useState<string>("")
  const [userName, setUserName] = useState<string>("")
  const activeTab: "scanner" | "wall" = view === "wall" ? "wall" : "scanner"

  const [isWallLoading, setIsWallLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("internleaks_token")
    const savedCredits = localStorage.getItem("internleaks_credits")
    const savedEmail = localStorage.getItem("internleaks_user_email")
    const savedName = localStorage.getItem("internleaks_user_name")
    
    if (token) {
      setIsLoggedIn(true)
      if (savedEmail) setUserEmail(savedEmail)
      if (savedName) setUserName(savedName)
      if (savedCredits) setCredits(parseInt(savedCredits))
      else setCredits(4)
    }
  }, [])

  useEffect(() => {
    const fetchAllReports = async () => {
      setIsWallLoading(true) 
      try {
        const response = await axios.get("http://localhost:8080/api/v1/reports/all");
        const sortedData = response.data.sort((a: any, b: any) => b.id - a.id);
        setReports(sortedData); 
      } catch (error) {
        console.error("Failed to fetch Scam Wall data:", error);
      } finally {
        setIsWallLoading(false) 
      }
    };
    fetchAllReports();
  }, []);

  const handleVerify = () => {
    if (credits > 0) setView("wizard")
    else {
      if (isLoggedIn) alert("⚠️ You have 0 credits left! Razorpay integration to buy more credits is coming soon.")
      else setAuthOpen(true)
    }
  }

  const handleAuthenticated = (authMode: "signin" | "signup", backendCredits: number) => {
    setCredits(backendCredits)
    localStorage.setItem("internleaks_credits", backendCredits.toString())
    
    const savedEmail = localStorage.getItem("internleaks_user_email")
    if (savedEmail) setUserEmail(savedEmail)
    const savedName = localStorage.getItem("internleaks_user_name")
    if (savedName) setUserName(savedName)

    setIsLoggedIn(true)
    setAuthOpen(false)
    setView("wizard")
  }

  const handleLogout = () => {
    localStorage.removeItem("internleaks_token")
    localStorage.removeItem("internleaks_credits")
    localStorage.removeItem("internleaks_user_email")
    localStorage.removeItem("internleaks_user_name")

    setIsLoggedIn(false)
    setCredits(2)
    setUserEmail("")
    setUserName("")
    setView("landing")
  }

  const handleWizardSubmit = async () => {
    if (credits <= 0) {
      if (isLoggedIn) alert("⚠️ You have 0 credits left! Razorpay integration to buy more credits is coming soon.")
      else setAuthOpen(true)
      return
    }

    let nextCredits = 0;
    setCredits((c) => {
      nextCredits = Math.max(0, c - 1);
      localStorage.setItem("internleaks_credits", nextCredits.toString());
      
      const email = localStorage.getItem("internleaks_user_email");
      const token = localStorage.getItem("internleaks_token");
      if (token && email) {
        axios.post("http://localhost:8080/api/v1/auth/update-credits", {
          email: email,
          credits: nextCredits
        }).catch(err => console.error("Failed to sync credits with database:", err));
      }
      return nextCredits;
    });

    setView("analyzing")

    try {
      let aiResult;
      let rawResponseData;

      // 🤖 ASLI AI API CALLS (Gemini Engine)
      if (selectedFile) {
        const formData = new FormData()
        formData.append("file", selectedFile)
        
        const response = await axios.post("http://localhost:8080/api/v1/analyze-image", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        rawResponseData = response.data;
      } else {
        const jobContext = `Website: ${wizard.companyWebsite}. Payment: ${wizard.paymentDemanded}. Interview: ${wizard.interviewTaken}. HR Email: ${wizard.hrEmailDomain}`
        const response = await axios.post("http://localhost:8080/api/v1/analyze", {
          companyName: wizard.companyName,
          jobDetails: jobContext
        })
        rawResponseData = response.data;
      }

      // 🛠️ AI OUTPUT CLEANUP
      if (typeof rawResponseData === "string") {
        let cleanString = rawResponseData.replace(/```json/g, "").replace(/```/g, "").trim();
        
        const startIdx = cleanString.indexOf('{');
        const endIdx = cleanString.lastIndexOf('}');
        if (startIdx !== -1 && endIdx !== -1) {
          cleanString = cleanString.substring(startIdx, endIdx + 1);
        }
        
        aiResult = JSON.parse(cleanString);
      } else {
        aiResult = rawResponseData;
      }

      console.log("Parsed AI Analysis:", aiResult)

      const validCheck = aiResult.isValidDocument !== undefined ? aiResult.isValidDocument : true
      setIsValidDoc(validCheck)

      const finalReport: ScamReport = {
        id: Date.now(),
        companyName: wizard.companyName || "Unknown Company",
        companyWebsite: wizard.companyWebsite,
        paymentDemanded: wizard.paymentDemanded || "Not Sure",
        interviewTaken: wizard.interviewTaken || "Not Sure",
        hrEmailDomain: wizard.hrEmailDomain,
        userSuspicionFeedback: wizard.userSuspicionFeedback,
        riskPercentage: aiResult.riskPercentage, 
        verdict: aiResult.verdict,
        redFlags: aiResult.redFlags || [],
        reportedAt: new Date().toISOString().slice(0, 19),
        reportCount: 1,
      }

      setCurrentReport(finalReport)

      if (isLoggedIn && userEmail) {
        try {
          const token = localStorage.getItem("internleaks_token"); 

          const historyPayload = {
            ...finalReport,
            id: null, 
            userEmail: userEmail,
            redFlags: finalReport.redFlags.join(" | "), 
            verdict: finalReport.verdict.length > 240 
                     ? finalReport.verdict.substring(0, 240) + "..." 
                     : finalReport.verdict
          }

          await axios.post("http://localhost:8080/api/v1/scan-history/add", historyPayload, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
          })
        } catch (err) {
          console.error("Failed to save history to DB:", err)
        }
      }

    } catch (error: any) {
      console.error("AI Analysis Failed:", error)
      alert("AI Engine fail ho gaya! Spring Boot console check karo (API key issue ho sakta hai).")
      setView("landing")
    }
  }

  const handleReportToWall = async (report: ScamReport) => {
    try {
      const safeDescription = `AI Verdict: ${report.verdict}`
      const finalDescription = safeDescription.length > 240 ? safeDescription.substring(0, 240) + "..." : safeDescription;

      const backendPayload = {
        userEmail: userEmail,
        companyName: report.companyName || "Unknown Company",
        // 🔥 NAYA FIX: Saari details as it is backend ko bhej rahe hain
        companyWebsite: report.companyWebsite || "Not Provided",
        hrEmailDomain: report.hrEmailDomain || "Not Provided",
        paymentDemanded: report.paymentDemanded || "Not Sure",
        interviewTaken: report.interviewTaken || "Not Sure",
        scamType: report.riskPercentage > 50 ? "High Risk Fraud" : "Suspicious",
        description: finalDescription, 
        riskPercentage: report.riskPercentage,
        verdict: report.verdict,
        redFlags: report.redFlags.join(" | ") // Array ko string banakar bhej rahe hain
      }

      const response = await axios.post("http://localhost:8080/api/v1/reports/add", backendPayload)
      
      if (response.status === 200 || response.status === 201) {
        console.log("Data successfully saved in Spring Boot Database!", response.data)
        setReports((prev) => [report, ...prev])
        alert("Report submitted successfully to the Scam Wall!")
      }
    } catch (error: any) {
      console.error("Backend connection error:", error)
      if (error.response) {
        alert(`🚨 SERVER ERROR ${error.response.status}: Backend request fail ho gayi. Console dekho!`);
      } else if (error.request) {
        alert(`🚨 NETWORK ERROR: Spring Boot server se connect nahi ho raha.`);
      } else {
        alert(`🚨 ERROR: ${error.message}`);
      }
    }
  }

  const handleScanAnother = () => {
    setWizard(emptyWizardInput)
    setCurrentReport(null)
    setView("landing")
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0B0F19]">

      <Navbar
        activeTab={activeTab} 
        credits={credits}
        isLoggedIn={isLoggedIn} 
        userEmail={userEmail} 
        userName={userName} 
        onNavigate={(v) => setView(v)}
        onOpenAuth={() => setAuthOpen(true)}
        onLogout={handleLogout}
        onOpenDashboard={() => setView("dashboard")}
        onOpenEditProfile={() => setEditProfileOpen(true)}
      />

      <main className="flex-1">
        <div key={view} className="animate-float-up">
          {view === "landing" && (
            <LandingView 
              onVerify={handleVerify} 
              onFileSelect={(file) => setSelectedFile(file)}
            />
          )}

          {view === "wizard" && (
            <WizardView
              input={wizard}
              onChange={setWizard}
              onSubmit={handleWizardSubmit}
            />
          )}

          {view === "analyzing" && (
            <AnalyzingView onComplete={() => setView("result")} />
          )}

          {view === "result" && currentReport && (
            <ResultView
              report={currentReport}
              onReport={handleReportToWall}
              onScanAnother={handleScanAnother}
              isValidDocument={isValidDoc} 
            />
          )}

          {view === "wall" && <ScamWallView reports={reports as any} isLoading={isWallLoading} />}
          
          {view === "dashboard" && (
            <DashboardView 
              userEmail={userEmail} 
              userName={userName}
              credits={credits}
              onNavigateBack={() => setView("landing")} 
              onReportDeleted={(deletedId) => {
                setReports((prev) => prev.filter((r) => r.id !== deletedId))
              }}
            />
          )}

          {view === "admin" && (
            <AdminView 
              onNavigateBack={() => setView("landing")} 
            />
          )}
        </div>
      </main>

      <Footer />

      <AuthModal
        open={authOpen}
        onOpenChange={setAuthOpen}
        onAuthenticated={handleAuthenticated}
      />

      <EditProfileModal
        open={editProfileOpen}
        onOpenChange={setEditProfileOpen}
        userEmail={userEmail}
        onProfileUpdated={(newName) => {
            setUserName(newName)
            localStorage.setItem("internleaks_user_name", newName)
        }}
      />
    </div>
  )
}

function computeRisk(w: WizardInput): number { return 50 }
function verdictFor(risk: number): string { return "Unknown" }
function buildRedFlags(w: WizardInput): string[] { return [] }