import { motion } from "framer-motion";
import { ShieldAlert, FileSearch, TrendingUp, DollarSign } from "lucide-react";

interface KpiCardsProps {
  total: number;
  flagged: number;
  underReview: number;
  avgRisk: number;
  totalExposure: number;
}

const cards = [
  { key: "total", label: "Total Claims", icon: FileSearch, format: (v: number) => v.toLocaleString() },
  { key: "flagged", label: "High Risk Flagged", icon: ShieldAlert, format: (v: number) => v.toLocaleString(), accent: "risk-high" },
  { key: "avgRisk", label: "Avg Risk Score", icon: TrendingUp, format: (v: number) => `${v}/100` },
  { key: "totalExposure", label: "Risk Exposure", icon: DollarSign, format: (v: number) => `$${(v / 1000000).toFixed(2)}M` },
] as const;

export function KpiCards({ total, flagged, avgRisk, totalExposure }: KpiCardsProps) {
  const values = { total, flagged, avgRisk, totalExposure };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
          className="kpi-card group"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{card.label}</p>
              <p className="text-2xl font-bold font-mono mt-2 text-foreground">
                {card.format(values[card.key])}
              </p>
            </div>
            <div className={`p-2 rounded-md ${"accent" in card && card.accent === "risk-high" ? "bg-risk-high/10 text-risk-high" : "bg-primary/10 text-primary"}`}>
              <card.icon className="w-5 h-5" />
            </div>
          </div>
          {card.key === "flagged" && (
            <div className="mt-3 flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-risk-high animate-pulse-glow" />
              <span className="text-xs text-muted-foreground">
                {((flagged / total) * 100).toFixed(1)}% of total claims
              </span>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
