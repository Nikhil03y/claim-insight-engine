import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Search, Filter } from "lucide-react";
import type { Claim, RiskLevel, ClaimType } from "@/lib/mockData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ClaimsTableProps {
  claims: Claim[];
  onSelectClaim: (claim: Claim) => void;
}

type SortKey = "riskScore" | "amount" | "filingDate" | "policyHolder";

export function ClaimsTable({ claims, onSelectClaim }: ClaimsTableProps) {
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<RiskLevel | "All">("All");
  const [typeFilter, setTypeFilter] = useState<ClaimType | "All">("All");
  const [sortKey, setSortKey] = useState<SortKey>("riskScore");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(0);
  const perPage = 15;

  const filtered = claims.filter((c) => {
    if (riskFilter !== "All" && c.riskLevel !== riskFilter) return false;
    if (typeFilter !== "All" && c.type !== typeFilter) return false;
    if (search && !c.policyHolder.toLowerCase().includes(search.toLowerCase()) && !c.claimNumber.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    const mul = sortDir === "asc" ? 1 : -1;
    if (sortKey === "policyHolder") return mul * a.policyHolder.localeCompare(b.policyHolder);
    if (sortKey === "filingDate") return mul * a.filingDate.localeCompare(b.filingDate);
    return mul * ((a[sortKey] as number) - (b[sortKey] as number));
  });

  const paginated = sorted.slice(page * perPage, (page + 1) * perPage);
  const totalPages = Math.ceil(sorted.length / perPage);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
    setPage(0);
  }

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return null;
    return sortDir === "desc" ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="kpi-card"
    >
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder="Search claims..."
            className="w-full bg-secondary border border-border rounded-md pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex gap-2 items-center">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={riskFilter} onValueChange={(val) => { setRiskFilter(val as RiskLevel | "All"); setPage(0); }}>
            <SelectTrigger className="w-[130px] bg-secondary border-border text-sm">
              <SelectValue placeholder="All Risk" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Risk</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={(val) => { setTypeFilter(val as ClaimType | "All"); setPage(0); }}>
            <SelectTrigger className="w-[130px] bg-secondary border-border text-sm">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Types</SelectItem>
              <SelectItem value="Auto">Auto</SelectItem>
              <SelectItem value="Property">Property</SelectItem>
              <SelectItem value="Health">Health</SelectItem>
              <SelectItem value="Life">Life</SelectItem>
              <SelectItem value="Liability">Liability</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wider">
              <th className="text-left py-3 px-3 font-medium">Claim #</th>
              <th className="text-left py-3 px-3 font-medium cursor-pointer select-none" onClick={() => toggleSort("policyHolder")}>
                <span className="flex items-center gap-1">Holder <SortIcon col="policyHolder" /></span>
              </th>
              <th className="text-left py-3 px-3 font-medium">Type</th>
              <th className="text-right py-3 px-3 font-medium cursor-pointer select-none" onClick={() => toggleSort("amount")}>
                <span className="flex items-center justify-end gap-1">Amount <SortIcon col="amount" /></span>
              </th>
              <th className="text-left py-3 px-3 font-medium cursor-pointer select-none" onClick={() => toggleSort("filingDate")}>
                <span className="flex items-center gap-1">Filed <SortIcon col="filingDate" /></span>
              </th>
              <th className="text-center py-3 px-3 font-medium cursor-pointer select-none" onClick={() => toggleSort("riskScore")}>
                <span className="flex items-center justify-center gap-1">Risk <SortIcon col="riskScore" /></span>
              </th>
              <th className="text-left py-3 px-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((claim) => (
              <tr
                key={claim.id}
                className="data-table-row"
                onClick={() => onSelectClaim(claim)}
              >
                <td className="py-3 px-3 font-mono text-xs text-primary">{claim.claimNumber}</td>
                <td className="py-3 px-3 text-foreground font-medium">{claim.policyHolder}</td>
                <td className="py-3 px-3 text-muted-foreground">{claim.type}</td>
                <td className="py-3 px-3 text-right font-mono text-foreground">₹{claim.amount.toLocaleString('en-IN')}</td>
                <td className="py-3 px-3 text-muted-foreground">{claim.filingDate}</td>
                <td className="py-3 px-3 text-center">
                  <span className={`inline-flex items-center justify-center w-10 h-6 rounded text-xs font-mono font-bold ${
                    claim.riskLevel === "High" ? "risk-badge-high" : claim.riskLevel === "Medium" ? "risk-badge-medium" : "risk-badge-low"
                  }`}>
                    {claim.riskScore}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    claim.status === "Flagged" || claim.status === "Denied" ? "bg-risk-high/10 text-risk-high" :
                    claim.status === "Under Review" ? "bg-risk-medium/10 text-risk-medium" :
                    "bg-secondary text-secondary-foreground"
                  }`}>
                    {claim.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
        <span>{sorted.length} claims found</span>
        <div className="flex items-center gap-2">
          <button
            disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
            className="px-3 py-1 rounded bg-secondary text-secondary-foreground disabled:opacity-30 hover:bg-secondary/80"
          >
            Prev
          </button>
          <span className="font-mono">{page + 1} / {totalPages}</span>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage(p => p + 1)}
            className="px-3 py-1 rounded bg-secondary text-secondary-foreground disabled:opacity-30 hover:bg-secondary/80"
          >
            Next
          </button>
        </div>
      </div>
    </motion.div>
  );
}
