"use client";

import { useEffect, useState, use } from "react";
import { useWallet } from "@/components/providers/WalletProvider";
import { Loader2, CheckCircle2, XCircle, Wallet, Send } from "lucide-react";
import WalletConnectButton from "@/components/WalletConnectButton";
import Modal from "@/components/Modal";

interface Question {
  id: string;
  text: string;
  type: string;
}

interface Survey {
  id: string;
  title: string;
  description: string;
  rewardPerRespondent: number;
  questions: Question[];
}

export default function PublicSurveyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { address, isConnected, connect, disconnect } = useWallet();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; score?: number; payoutTx?: string; feedback?: string } | null>(null);

  const [modal, setModal] = useState<{ isOpen: boolean; title: string; message: string; type: "default" | "error" | "success" }>({
    isOpen: false,
    title: "",
    message: "",
    type: "default"
  });

  const showModal = (title: string, message: string, type: "default" | "error" | "success" = "default") => {
    setModal({ isOpen: true, title, message, type });
  };

  const closeModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }));
  };

  useEffect(() => {
    async function fetchSurvey() {
      try {
        const res = await fetch(`/api/survey/${id}`);
        const data = await res.json();
        if (data.success) {
          setSurvey(data.survey);
        }
      } catch (error) {
        console.error("Failed to fetch survey", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSurvey();
  }, [id]);

  const handleSubmit = async () => {
    if (!isConnected || !address) {
      showModal("Wallet Required", "Please connect your wallet first!", "error");
      return;
    }

    // Validate all questions answered
    if (survey && Object.keys(answers).length < survey.questions.length) {
      showModal("Incomplete Survey", "Please answer all questions before submitting.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        surveyId: id,
        walletAddress: address,
        answers: survey?.questions.map(q => ({
          questionId: q.id,
          question: q.text,
          answer: answers[q.id]
        }))
      };

      const res = await fetch("/api/survey/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      
      if (!res.ok) {
        showModal("Submission Failed", data.error || "Something went wrong.", "error");
        return;
      }

      setResult(data);

    } catch (error) {
      console.error("Submission error", error);
      showModal("Error", "Failed to submit survey. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-primary animate-pulse">Loading Survey...</div>;
  }

  if (!survey) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Survey not found</div>;
  }

  if (result) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full glass-panel p-8 rounded-2xl text-center space-y-6 animate-in zoom-in-95">
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${result.success ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}`}>
            {result.success ? <CheckCircle2 className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-2">{result.success ? "Survey Approved!" : "Submission Rejected"}</h2>
            <p className="text-gray-400">{result.message}</p>
          </div>

          {result.feedback && (
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-left">
              <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider">AI Feedback</div>
              <p className="text-sm text-gray-300 italic">"{result.feedback}"</p>
            </div>
          )}

          {result.success && (
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="text-sm text-gray-500 mb-1">AI Quality Score</div>
              <div className="text-3xl font-bold text-primary">{result.score?.toFixed(1)}/10</div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="text-xs text-gray-500 mb-1">Payout Transaction</div>
                <div className="font-mono text-xs text-gray-300 break-all">{result.payoutTx}</div>
              </div>
            </div>
          )}

          <div className="pt-4">
            <p className="text-sm text-gray-500">Thank you for your participation.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-3xl mx-auto space-y-8 pb-64">
      <Modal 
        isOpen={modal.isOpen} 
        onClose={closeModal} 
        title={modal.title} 
        type={modal.type}
      >
        {modal.message}
      </Modal>

      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-50" />
        
        <div className="relative p-8 md:p-12 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-400 mb-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live Survey
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            {survey.title}
          </h1>
          
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {survey.description}
          </p>

          <div className="flex justify-center gap-4 pt-4">
            <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-sm text-gray-500 mb-1">Reward</div>
              <div className="text-2xl font-bold text-[#00f0ff]">{survey.rewardPerRespondent} QUs</div>
            </div>
            <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-sm text-gray-500 mb-1">Questions</div>
              <div className="text-2xl font-bold text-white">{survey.questions.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {survey.questions.map((q, index) => (
          <div key={q.id} className="glass-panel p-6 md:p-8 rounded-2xl space-y-4 group hover:border-primary/30 transition duration-500">
            <h3 className="font-medium text-xl flex gap-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold text-sm shrink-0">
                {index + 1}
              </span>
              <span className="pt-0.5">{q.text}</span>
            </h3>
            <textarea 
              rows={3}
              value={answers[q.id] || ""}
              onChange={(e) => setAnswers({...answers, [q.id]: e.target.value})}
              placeholder="Type your answer here..."
              className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-primary focus:bg-black/40 transition text-lg"
            />
          </div>
        ))}
      </div>

      {/* Spacer for Fixed Footer */}
      <div className="h-24 md:h-32" />

      {/* Footer / Submit */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/90 to-transparent z-50">
        <div className="max-w-3xl mx-auto">
          <div className="glass-panel p-4 rounded-2xl flex items-center justify-between shadow-[0_0_50px_rgba(0,0,0,0.5)] border-primary/20 bg-[#0a0a0a]/90 backdrop-blur-xl">
              <div className="flex items-center gap-4 pl-2">
                {!isConnected ? (
                  <div className="text-yellow-500 flex items-center gap-2 text-sm font-medium">
                    <Wallet className="w-4 h-4" /> Connect wallet to submit
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="text-green-500 flex items-center gap-2 text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4" /> Wallet Connected: <span className="font-mono text-xs text-green-400">{address?.slice(0, 6)}...{address?.slice(-6)}</span>
                    </div>
                    <button 
                      onClick={disconnect}
                      className="text-xs text-red-500 hover:text-red-400 underline"
                    >
                      Disconnect
                    </button>
                  </div>
                )}
              </div>

            {!isConnected ? (
              <WalletConnectButton />
            ) : (
              <button 
                onClick={handleSubmit}
                disabled={submitting}
                className="px-8 py-3 bg-[#00f0ff] text-black font-bold rounded-xl hover:bg-[#00f0ff]/90 transition disabled:opacity-50 flex items-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {submitting ? "Verifying..." : "Submit Answers"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
