import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { motion } from "framer-motion";

interface ClaimsTimelineChartProps {
  byMonth: Record<string, { total: number; flagged: number }>;
}

export function ClaimsTimelineChart({ byMonth }: ClaimsTimelineChartProps) {
  const data = Object.entries(byMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, values]) => ({
      month: new Date(month + "-01").toLocaleDateString("en-US", { month: "short" }),
      total: values.total,
      flagged: values.flagged,
    }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="kpi-card"
    >
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Claims Timeline</h3>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 14%)" />
            <XAxis dataKey="month" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: "hsl(222, 44%, 8%)",
                border: "1px solid hsl(222, 30%, 16%)",
                borderRadius: "8px",
                color: "hsl(210, 40%, 93%)",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="total" fill="hsl(199, 89%, 48%)" radius={[3, 3, 0, 0]} name="Total" />
            <Bar dataKey="flagged" fill="hsl(0, 72%, 51%)" radius={[3, 3, 0, 0]} name="Flagged" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
