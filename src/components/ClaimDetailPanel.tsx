import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, User, Calendar, FileText, Shield, AlertTriangle } from "lucide-react";
import type { Claim } from "@/lib/mockData";

interface ClaimDetailPanelProps {
  claim: Claim | null;
  onClose: () => void;
}

function RiskMeter({ score }: { score: number }) {
  const color = score >= 70 ? "bg-risk-high" : score >= 40 ? "bg-risk-medium" : "bg-risk-low";
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">Risk Score</span>
        <span className="font-mono font-bold text-foreground">{score}/100</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export function ClaimDetailPanel({ claim, onClose }: ClaimDetailPanelProps) {
  return (
    <AnimatePresence>
      {claim && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border z-50 overflow-y-auto"
        >
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-sm text-primary">{claim.claimNumber}</p>
                <h2 className="text-lg font-semibold text-foreground mt-0.5">{claim.policyHolder}</h2>
              </div>
              <button onClick={onClose} className="p-2 rounded-md hover:bg-secondary text-muted-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
              claim.riskLevel === "High" ? "risk-badge-high" : claim.riskLevel === "Medium" ? "risk-badge-medium" : "risk-badge-low"
            }`}>
              <Shield className="w-3 h-3" />
              {claim.riskLevel} Risk
            </div>

            <RiskMeter score={claim.riskScore} />

            <div className="grid grid-cols-2 gap-3">
              <ScoreCard label="Rule Engine" score={claim.ruleScore} />
              <ScoreCard label="ML Anomaly" score={claim.mlScore} />
            </div>

            <div className="space-y-3">
              <DetailRow icon={FileText} label="Type" value={claim.type} />
              <DetailRow icon={Calendar} label="Filed" value={claim.filingDate} />
              <DetailRow icon={Calendar} label="Incident" value={claim.incidentDate} />
              <DetailRow icon={MapPin} label="Location" value={claim.location} />
              <DetailRow icon={User} label="Adjuster" value={claim.adjuster} />
              <DetailRow
                icon={FileText}
                label="Amount"
                value={`$${claim.amount.toLocaleString()}`}
              />
              <DetailRow
                icon={Shield}
                label="Police Report"
                value={claim.hasPoliceReport ? "Yes" : "No"}
              />
            </div>

            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Description</p>
              <p className="text-sm text-secondary-foreground bg-secondary/50 p-3 rounded-md">{claim.description}</p>
            </div>

            {claim.flags.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-risk-high" /> Risk Flags
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {claim.flags.map((flag) => (
                    <span key={flag} className="risk-badge-high px-2 py-0.5 rounded text-xs">
                      {flag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ScoreCard({ label, score }: { label: string; score: number }) {
  return (
    <div className="bg-secondary/50 rounded-md p-3 text-center">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-xl font-mono font-bold text-foreground mt-1">{score}</p>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
      <span className="text-muted-foreground w-24">{label}</span>
      <span className="text-foreground font-medium">{value}</span>
    </div>
  );
}
