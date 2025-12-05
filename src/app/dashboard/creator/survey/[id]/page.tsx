import { CheckCircle2, Clock, XCircle } from "lucide-react";

export default function SurveyDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">Customer Satisfaction Survey Q1</h1>
            <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold border border-green-500/20">
              ACTIVE
            </span>
          </div>
          <p className="text-gray-400 max-w-2xl">
            A survey to understand customer sentiment regarding our latest product launch.
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">Contract Balance</div>
          <div className="text-2xl font-mono text-primary font-bold">45,000 QUs</div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl">
          <div className="text-sm text-gray-500">Total Respondents</div>
          <div className="text-xl font-bold">45 / 100</div>
          <div className="w-full bg-gray-800 h-1 mt-2 rounded-full overflow-hidden">
            <div className="bg-primary h-full w-[45%]" />
          </div>
        </div>
        <div className="glass-panel p-4 rounded-xl">
          <div className="text-sm text-gray-500">Reward / Person</div>
          <div className="text-xl font-bold font-mono">1,000 QUs</div>
        </div>
        <div className="glass-panel p-4 rounded-xl">
          <div className="text-sm text-gray-500">AI Approval Rate</div>
          <div className="text-xl font-bold text-green-400">92%</div>
        </div>
        <div className="glass-panel p-4 rounded-xl">
          <div className="text-sm text-gray-500">Time Remaining</div>
          <div className="text-xl font-bold">2 Days</div>
        </div>
      </div>

      {/* Respondents Table */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h3 className="font-bold text-lg">Respondent Activity</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-gray-400">
              <tr>
                <th className="p-4 font-medium">Wallet Address</th>
                <th className="p-4 font-medium">Submission Time</th>
                <th className="p-4 font-medium">AI Score</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Payout</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="hover:bg-white/5 transition">
                  <td className="p-4 font-mono text-gray-300">
                    JZO...9X2
                  </td>
                  <td className="p-4 text-gray-500">
                    2 mins ago
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full w-[95%]" />
                      </div>
                      <span className="text-xs font-bold text-green-400">9.5/10</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium border border-green-500/20">
                      <CheckCircle2 className="w-3 h-3" /> Approved
                    </span>
                  </td>
                  <td className="p-4 text-right font-mono text-primary">
                    +1,000 QUs
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
