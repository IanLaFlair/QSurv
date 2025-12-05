"use client";

import { useEffect, useState, use } from "react";
import { ArrowLeft, Copy, Check, ExternalLink, Users, DollarSign, Globe } from "lucide-react";
import Link from "next/link";
import { useWallet } from "@/components/providers/WalletProvider";

interface Question {
  id: string;
  text: string;
  type: string;
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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <Link href="/dashboard" className="text-gray-400 hover:text-white flex items-center gap-2 mb-4 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{survey.title}</h1>
            <p className="text-gray-400 max-w-2xl">{survey.description}</p>
          </div>
          <div className="flex items-center gap-2 bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-sm font-medium border border-green-500/20">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Active
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
