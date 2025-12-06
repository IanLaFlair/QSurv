"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, DollarSign, Users, Save, Loader2 } from "lucide-react";
import { useWallet } from "@/components/providers/WalletProvider";
import ReferralFlowModal from "@/components/ReferralFlowModal";

export default function CreateSurveyPage() {
  const router = useRouter();
  const { address, isConnected } = useWallet();
  const [questions, setQuestions] = useState([{ id: 1, text: "", type: "text" }]);
  const [rewardPool, setRewardPool] = useState(1000);
  const [totalRespondents, setTotalRespondents] = useState(10);
  
  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);

  // AI Generator State
  const [mode, setMode] = useState<"manual" | "ai">("manual");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Referral Modal State
  const [showReferralModal, setShowReferralModal] = useState(false);

  const generateQuestions = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    try {
      const res = await fetch("/api/survey/generate", {
        method: "POST",
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.success) {
        setTitle(data.title);
        setDescription(data.description);
        
        const newQuestions = data.questions.map((q: any, i: number) => ({
          id: Date.now() + i,
          text: q.text,
          type: q.type
        }));
        setQuestions(newQuestions);
        setMode("manual"); // Switch back to view results
      } else {
        alert("AI Generation Failed: " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to generate questions. Check console for details.");
    } finally {
      setIsGenerating(false);
    }
  };

  const addQuestion = () => {
    setQuestions([...questions, { id: questions.length + 1, text: "", type: "text" }]);
  };

  const removeQuestion = (id: number) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleDeploy = async () => {
    if (!isConnected || !address) {
      alert("Please connect your wallet first!");
      return;
    }
    if (!title || !description) {
      alert("Please fill in the title and description.");
      return;
    }

    setIsDeploying(true);
    try {
      const res = await fetch("/api/survey/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          questions,
          rewardPool,
          maxRespondents: totalRespondents,
          creatorAddress: address,
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Simulate Smart Contract Call
        const ipfsMsg = data.ipfsHash ? `\n\n🌍 IPFS Hash: ${data.ipfsHash}` : "";
        alert(`Survey Created! ID: ${data.survey.id}${ipfsMsg}\n\n(Simulated) Locked ${rewardPool} QUs in Smart Contract.`);
        router.push("/dashboard");
      } else {
        alert("Failed to create survey: " + data.error);
      }
    } catch (error: any) {
      console.error("Deploy Error:", error);
      alert("An error occurred: " + (error.message || JSON.stringify(error)));
    } finally {
      setIsDeploying(false);
    }
  };

  const rewardPerRespondent = totalRespondents > 0 ? rewardPool / totalRespondents : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Referral Flow Modal */}
      <ReferralFlowModal
        isOpen={showReferralModal}
        onClose={() => setShowReferralModal(false)}
        rewardPerRespondent={rewardPerRespondent}
      />
      
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold mb-2">Create New Survey</h1>
          <p className="text-gray-400">Design your survey and fund the smart contract.</p>
        </div>
        
        {/* Global Mode Switch */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-secondary rounded-lg blur opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          
          <div className="relative p-[2px] rounded-lg overflow-hidden">
            {/* Spinning Border */}
            <div className="absolute inset-[-100%] bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#00f0ff_50%,#000000_100%)] animate-[spin_3s_linear_infinite]" />
            
            <div className="relative flex bg-black rounded-lg p-1">
              <button 
                onClick={() => setMode("manual")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition relative z-10 ${mode === "manual" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"}`}
              >
                Manual
              </button>
              <button 
                onClick={() => setMode("ai")}
                className={`px-4 py-2 rounded-md text-sm font-bold transition flex items-center gap-2 relative z-10 ${mode === "ai" ? "bg-[var(--primary)] text-[var(--background)] shadow-[0_0_15px_rgba(0,240,255,0.8)]" : "text-[var(--primary)] hover:text-white"}`}
              >
                <span className="text-lg animate-pulse">✨</span> 
                <span className={mode === "ai" ? "animate-pulse" : ""}>AI Auto</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Input Section (Only visible in AI mode) */}
      {mode === "ai" && (
        <div className="glass-panel p-6 rounded-2xl space-y-4 border-primary/20 bg-primary/5 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 text-primary font-bold">
            <span className="text-xl">✨</span> 
            <h3>AI Assistant</h3>
          </div>
          <p className="text-sm text-gray-400">Describe your survey topic, and AI will generate the <b>Title</b>, <b>Description</b>, and <b>Questions</b> for you.</p>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A survey about crypto hoodie preferences..." 
              className="flex-1 bg-black/20 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition"
            />
            <button 
              onClick={generateQuestions}
              disabled={isGenerating}
              className="px-6 py-3 bg-[var(--primary)] text-[var(--background)] font-bold rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.5)]"
            >
              {isGenerating ? "Generating..." : "✨ Generate"}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="font-bold text-lg border-b border-white/10 pb-2">Basic Details</h3>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Survey Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Product Feedback 2025" 
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
              <textarea 
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe what this survey is about..." 
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition"
              />
            </div>
          </div>

          {/* Questions */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <h3 className="font-bold text-lg">Questions</h3>
              <button onClick={addQuestion} className="text-xs flex items-center gap-1 text-primary hover:text-primary/80">
                <Plus className="w-3 h-3" /> Add Question
              </button>
            </div>
            
            <div className="space-y-4">
              {questions.map((q, index) => (
                <div key={q.id} className="flex gap-3 items-start animate-in fade-in">
                  <span className="mt-3 text-sm text-gray-500 font-mono">Q{index + 1}</span>
                  <div className="flex-1">
                    <input 
                      type="text" 
                      value={q.text}
                      onChange={(e) => {
                        const newQ = [...questions];
                        newQ[index].text = e.target.value;
                        setQuestions(newQ);
                      }}
                      placeholder="Type your question here..." 
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition"
                    />
                  </div>
                  <button 
                    onClick={() => removeQuestion(q.id)}
                    className="mt-3 text-gray-600 hover:text-red-500 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Funding & Actions */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-6 sticky top-24">
            <h3 className="font-bold text-lg border-b border-white/10 pb-2 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" /> Funding
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Total Reward Pool (QUs)</label>
                <input 
                  type="number" 
                  value={rewardPool}
                  onChange={(e) => setRewardPool(Number(e.target.value))}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition font-mono text-right"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Total Respondents</label>
                <div className="relative">
                  <Users className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                  <input 
                    type="number" 
                    value={totalRespondents}
                    onChange={(e) => setTotalRespondents(Number(e.target.value))}
                    className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-primary transition font-mono text-right"
                  />
                </div>
              </div>

              {/* Reward Breakdown - Expandable */}
              <div className="p-5 bg-gradient-to-br from-primary/10 via-purple-500/5 to-secondary/10 rounded-xl border border-primary/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">Per Response Allocation</div>
                  <div className="text-2xl font-bold text-primary font-mono">
                    {rewardPerRespondent.toLocaleString()} QUs
                  </div>
                </div>

                {/* Expandable Breakdown */}
                <details className="group">
                  <summary className="cursor-pointer list-none">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition border border-white/10">
                      <span className="text-sm font-medium text-gray-300">💡 View Breakdown</span>
                      <svg className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </summary>

                  {/* Breakdown Content */}
                  <div className="mt-3 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    {/* Respondent */}
                    <div className="flex items-center justify-between p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                        <span className="text-sm text-gray-300">Respondent</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-white">
                          {(rewardPerRespondent * 0.6).toFixed(0)} QUs
                        </div>
                        <div className="text-xs text-blue-400">60%</div>
                      </div>
                    </div>

                    {/* L1 Referrer */}
                    <div className="flex items-center justify-between p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                        <span className="text-sm text-gray-300">L1 Referrer</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-white">
                          {(rewardPerRespondent * 0.25).toFixed(0)} QUs
                        </div>
                        <div className="text-xs text-purple-400">25%</div>
                      </div>
                    </div>

                    {/* L2 Referrer */}
                    <div className="flex items-center justify-between p-2 rounded-lg bg-pink-500/10 border border-pink-500/20">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-pink-400"></div>
                        <span className="text-sm text-gray-300">L2 Referrer</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-white">
                          {(rewardPerRespondent * 0.1).toFixed(0)} QUs
                        </div>
                        <div className="text-xs text-pink-400">10%</div>
                      </div>
                    </div>

                    {/* Platform Fee */}
                    <div className="flex items-center justify-between p-2 rounded-lg bg-gray-500/10 border border-gray-500/20">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                        <span className="text-sm text-gray-300">Platform Fee</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-white">
                          {(rewardPerRespondent * 0.05).toFixed(0)} QUs
                        </div>
                        <div className="text-xs text-gray-400">5%</div>
                      </div>
                    </div>
                  </div>
                </details>

                {/* How it Works Button */}
                <button
                  onClick={() => setShowReferralModal(true)}
                  className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/30 transition text-sm font-medium text-gray-300 hover:text-primary flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  How it Works
                </button>
              </div>
            </div>

            <button 
              onClick={handleDeploy}
              disabled={isDeploying}
              className="w-full py-3 bg-gradient-to-r from-[var(--primary)] to-cyan-500 text-black font-bold text-sm uppercase tracking-wider rounded-lg hover:opacity-90 transition shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isDeploying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isDeploying ? "Deploying..." : "Deploy Survey"}
            </button>
            <p className="text-xs text-center text-gray-500 font-mono">
              Gas Fee: ~0.0001 QUBIC • Locks {rewardPool.toLocaleString()} QUs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
