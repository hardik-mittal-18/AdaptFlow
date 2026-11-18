import { useState, useEffect } from "react";
import {
  FileText,
  Search,
  Activity,
  ShieldCheck,
  Filter
} from "lucide-react";
import { api } from "../../services/api";

export const AuditLogsView = () => {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const res = await api.getAuditLogs();
      setLogs(res.logs || []);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredLogs = logs.filter((l) => {
    const matchesSearch =
      (l.details || "").toLowerCase().includes(search.toLowerCase()) ||
      (l.action || "").toLowerCase().includes(search.toLowerCase()) ||
      (l.userName || l.user_email || "").toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filterType !== "all") return (l.entityType || l.category) === filterType;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800/80 p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl shrink-0 border border-blue-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Enterprise Security Audit Logs &amp; Governance Trail
            </h2>
            <div className="text-xs text-slate-300 mt-1 max-w-2xl">
              Immutable audit ledger tracking model promotions, retraining loop triggers, predictions, verified feedback submissions, and system configuration updates.
            </div>
          </div>
        </div>

        <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-3 py-1 rounded-xl border border-blue-500/20 font-bold shrink-0">
          {logs.length} Recorded Events
        </span>
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800/80 p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search audit actions, users, or details..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl w-72 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: "all", label: "All Events" },
              { id: "deployment", label: "Deployments" },
              { id: "retraining", label: "Retraining" },
              { id: "monitoring", label: "Drift Checks" },
              { id: "feedback", label: "Feedback" }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterType(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all border ${
                  filterType === tab.id
                    ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20"
                    : "bg-slate-950/60 text-slate-400 hover:text-slate-200 border-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3">User / System</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Action</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Event Details</th>
                <th className="py-3 px-3 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredLogs.map((l) => (
                <tr key={l.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 text-slate-400 text-[11px] whitespace-nowrap">
                    {l.timestamp || l.created_at ? new Date(l.timestamp || l.created_at).toLocaleTimeString() : "--"} · {l.timestamp || l.created_at ? new Date(l.timestamp || l.created_at).toLocaleDateString() : "--"}
                  </td>
                  <td className="py-3 px-3 font-semibold text-white">
                    {l.userName || l.user_email || "System"}
                  </td>
                  <td className="py-3 px-3 capitalize text-slate-300">
                    {(l.userRole || l.user_role || "system").replace("_", " ")}
                  </td>
                  <td className="py-3 px-3 font-bold text-blue-400">{l.action}</td>
                  <td className="py-3 px-3">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                      {l.entityType || l.category || "audit"}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-200 max-w-md truncate">{l.details}</td>
                  <td className="py-3 px-3 text-right font-mono text-slate-500 text-[11px]">
                    {l.ipAddress || "127.0.0.1"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogsView;
