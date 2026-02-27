import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";

interface RiskDistributionChartProps {
  byRisk: Record<string, number>;
}

const RISK_COLORS: Record<string, string> = {
  Low: "hsl(152, 69%, 45%)",
  Medium: "hsl(38, 92%, 50%)",
  High: "hsl(0, 72%, 51%)",
};

export function RiskDistributionChart({ byRisk }: RiskDistributionChartProps) {
  const data = Object.entries(byRisk).map(([name, value]) => ({ name, value }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="kpi-card"
    >
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Risk Distribution</h3>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={RISK_COLORS[entry.name] || "#666"} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "hsl(222, 44%, 8%)",
                border: "1px solid hsl(222, 30%, 16%)",
                borderRadius: "8px",
                color: "hsl(210, 40%, 93%)",
                fontSize: "12px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-4 mt-2">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: RISK_COLORS[entry.name] }} />
            {entry.name}: {entry.value}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
