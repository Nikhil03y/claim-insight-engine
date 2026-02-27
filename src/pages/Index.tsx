import { useState, useMemo } from "react";
import { generateMockClaims, getStats, type Claim } from "@/lib/mockData";
import { DashboardHeader } from "@/components/DashboardHeader";
import { KpiCards } from "@/components/KpiCards";
import { RiskDistributionChart } from "@/components/RiskDistributionChart";
import { ClaimsTimelineChart } from "@/components/ClaimsTimelineChart";
import { ClaimsTable } from "@/components/ClaimsTable";
import { ClaimDetailPanel } from "@/components/ClaimDetailPanel";

const Index = () => {
  const [claims, setClaims] = useState<Claim[]>(() => generateMockClaims(500));
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

  const stats = useMemo(() => getStats(claims), [claims]);

  const handleRefresh = () => {
    setClaims(generateMockClaims(500));
    setSelectedClaim(null);
  };

  return (
    <div className="min-h-screen bg-background px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
      <DashboardHeader onRefresh={handleRefresh} />

      <div className="space-y-6 pb-12">
        <KpiCards
          total={stats.total}
          flagged={stats.flagged}
          underReview={stats.underReview}
          avgRisk={stats.avgRisk}
          totalExposure={stats.totalExposure}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <RiskDistributionChart byRisk={stats.byRisk} />
          <div className="lg:col-span-2">
            <ClaimsTimelineChart byMonth={stats.byMonth} />
          </div>
        </div>

        <ClaimsTable claims={claims} onSelectClaim={setSelectedClaim} />
      </div>

      <ClaimDetailPanel claim={selectedClaim} onClose={() => setSelectedClaim(null)} />
    </div>
  );
};

export default Index;
