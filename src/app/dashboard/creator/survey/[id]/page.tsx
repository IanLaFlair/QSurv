"use client";

import { useEffect, useState, use } from "react";
import { ArrowLeft, Copy, Check, ExternalLink, Users, DollarSign, Globe, Eye } from "lucide-react";
import Link from "next/link";
import { useWallet } from "@/components/providers/WalletProvider";
import Modal from "@/components/Modal";

interface Question {
  id: string;
  text: string;
  type: string;
}

interface Response {
  id: string;
  walletAddress: string;
  answers: any;
  aiScore: number;
  isApproved: boolean;
  payoutTxHash?: string;
  createdAt: string;
}

interface Survey {
  id: string;
  title: string;
  description: string;
  ipfsHash: string;
  rewardPool: number;
  maxRespondents: number;
  rewardPerRespondent: number;
  createdAt: string;
  questions: Question[];
  responses: Response[];
  _count: {
    responses: number;
  };
}

export default function SurveyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params using React.use()
  const { id } = use(params);
  
  const { address } = useWallet();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState<Response | null>(null);

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

  const handleCopyLink = () => {
    const link = `${window.location.origin}/survey/${id}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return <div className="flex justify-center py-20 text-primary animate-pulse">Loading Survey Details...</div>;
  }

  if (!survey) {
    return <div className="text-center py-20 text-red-500">Survey not found</div>;
  }

  const shareLink = typeof window !== 'undefined' ? `${window.location.origin}/survey/${id}` : '';

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <Modal
        isOpen={!!selectedResponse}
        onClose={() => setSelectedResponse(null)}
        title="Respondent Answers"
        type="default"
      >
        {selectedResponse && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="bg-white/5 p-3 rounded-lg border border-white/10">
              <div className="text-xs text-gray-500 mb-1">Wallet Address</div>
              <div className="font-mono text-xs text-gray-300 break-all">{selectedResponse.walletAddress}</div>
            </div>
            
            <div className="space-y-3">
              {Array.isArray(selectedResponse.answers) ? selectedResponse.answers.map((ans: any, idx: number) => (
                <div key={idx} className="bg-black/30 p-3 rounded-lg border border-white/5">
                  <div className="text-xs text-gray-500 mb-1">Q{idx + 1}: {ans.question}</div>
                  <div className="text-sm text-white">{ans.answer}</div>
                </div>
              )) : (
                <div className="text-gray-400 italic">No detailed answers available.</div>
              )}
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-white/10">
              <div className="text-sm text-gray-400">AI Score</div>
              <div className={`text-lg font-bold ${selectedResponse.isApproved ? "text-green-500" : "text-red-500"}`}>
                {selectedResponse.aiScore}/10
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Header */}
      <div>
        <Link href="/dashboard/creator" className="text-gray-400 hover:text-white flex items-center gap-2 mb-4 transition">
          <ArrowLeft className="w-4 h-4" /> Back to My Surveys
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{survey.title}</h1>
            <p className="text-gray-400 max-w-2xl">{survey.description}</p>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${
            survey._count.responses < survey.maxRespondents 
              ? "bg-green-500/10 text-green-500 border-green-500/20" 
              : "bg-gray-500/10 text-gray-500 border-gray-500/20"
          }`}>
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              survey._count.responses < survey.maxRespondents ? "bg-green-500" : "bg-gray-500"
            }`} />
            {survey._count.responses < survey.maxRespondents ? "Active" : "Completed"}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-gray-400 text-sm">Responses</span>
          </div>
          <div className="text-2xl font-bold">
            {survey._count.responses} <span className="text-gray-500 text-sm font-normal">/ {survey.maxRespondents}</span>
          </div>
          <div className="w-full bg-gray-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-primary h-full rounded-full transition-all duration-500"
              style={{ width: `${(survey._count.responses / survey.maxRespondents) * 100}%` }}
            />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-gray-400 text-sm">Reward Pool</span>
          </div>
          <div className="text-2xl font-bold">{survey.rewardPool.toLocaleString()} QUs</div>
          <p className="text-xs text-gray-500 mt-1">{survey.rewardPerRespondent} QUs per respondent</p>
        </div>

        <div className="glass-panel p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-accent/10 rounded-lg text-accent">
              <Globe className="w-5 h-5" />
            </div>
            <span className="text-gray-400 text-sm">IPFS Storage</span>
          </div>
          <div className="text-xs font-mono text-gray-300 break-all bg-black/30 p-2 rounded border border-white/5">
            {survey.ipfsHash}
          </div>
          <a 
            href={`https://gateway.pinata.cloud/ipfs/${survey.ipfsHash}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-accent hover:underline mt-2 inline-flex items-center gap-1"
          >
            View on IPFS <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Share Section */}
      <div className="glass-panel p-6 rounded-xl border-primary/20">
        <h3 className="text-lg font-bold mb-4">Share Survey</h3>
        <div className="flex gap-2">
          <div 
            onClick={handleCopyLink}
            className="flex-1 bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-gray-300 font-mono text-sm truncate cursor-pointer hover:bg-white/5 transition flex items-center justify-between group"
            title="Click to Copy"
          >
            {shareLink}
            <Copy className="w-3 h-3 text-gray-500 group-hover:text-primary opacity-0 group-hover:opacity-100 transition" />
          </div>
          <button 
            onClick={handleCopyLink}
            className="bg-[#00f0ff] hover:bg-[#00f0ff]/90 text-black font-bold px-6 rounded-lg transition flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)]"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>
      </div>

      {/* Respondents Table */}
      <div className="glass-panel p-6 rounded-xl">
        <h3 className="text-lg font-bold mb-4">Respondents</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-sm">
                <th className="py-3 px-4">Wallet Address</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">AI Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Payout Tx</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {survey.responses && survey.responses.length > 0 ? (
                survey.responses.map((resp) => (
                  <tr key={resp.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="py-3 px-4 font-mono text-xs text-gray-300">
                      {resp.walletAddress.slice(0, 6)}...{resp.walletAddress.slice(-6)}
                    </td>
                    <td className="py-3 px-4 text-gray-400">
                      {new Date(resp.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-bold ${resp.aiScore >= 7 ? "text-green-500" : resp.aiScore >= 5 ? "text-yellow-500" : "text-red-500"}`}>
                        {resp.aiScore}/10
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {resp.isApproved ? (
                        <span className="inline-flex items-center gap-1 text-green-500 text-xs bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                          <Check className="w-3 h-3" /> Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-500 text-xs bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                          Rejected
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-gray-500">
                      {resp.payoutTxHash ? (
                        <span className="text-primary">{resp.payoutTxHash.slice(0, 8)}...</span>
                      ) : "-"}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button 
                        onClick={() => setSelectedResponse(resp)}
                        className="p-2 hover:bg-white/10 rounded-lg transition text-gray-400 hover:text-white"
                        title="View Answers"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500 italic">
                    No responses yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Questions Preview */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Questions ({survey.questions.length})</h3>
        {survey.questions.map((q, index) => (
          <div key={q.id} className="glass-panel p-4 rounded-xl flex gap-4">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center font-bold text-gray-500 text-sm shrink-0">
              {index + 1}
            </div>
            <div>
              <p className="font-medium text-gray-200">{q.text}</p>
              <span className="text-xs text-gray-500 uppercase tracking-wider mt-1 block">{q.type}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
