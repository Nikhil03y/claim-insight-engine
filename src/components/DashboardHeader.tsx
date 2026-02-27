import { ShieldCheck, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface DashboardHeaderProps {
  onRefresh: () => void;
}

export function DashboardHeader({ onRefresh }: DashboardHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between py-6"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <ShieldCheck className="w-7 h-7 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Ayushman Bharat Fraud Detection</h1>
          <p className="text-xs text-muted-foreground">Insurance Claims Risk Analysis Dashboard</p>
        </div>
      </div>
      <button
        onClick={onRefresh}
        className="flex items-center gap-2 px-4 py-2 rounded-md bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        Refresh Data
      </button>
    </motion.header>
  );
}
