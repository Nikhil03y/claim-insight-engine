export type RiskLevel = "Low" | "Medium" | "High";
export type ClaimType = "Auto" | "Property" | "Health" | "Life" | "Liability";
export type ClaimStatus = "Open" | "Under Review" | "Flagged" | "Closed" | "Denied";

export interface Claim {
  id: string;
  claimNumber: string;
  policyHolder: string;
  type: ClaimType;
  amount: number;
  filingDate: string;
  incidentDate: string;
  status: ClaimStatus;
  riskScore: number;
  riskLevel: RiskLevel;
  ruleScore: number;
  mlScore: number;
  hasPoliceReport: boolean;
  description: string;
  location: string;
  adjuster: string;
  flags: string[];
}

const firstNames = ["James", "Maria", "Robert", "Sarah", "Michael", "Jennifer", "David", "Lisa", "William", "Jessica", "Daniel", "Emily", "Thomas", "Amanda", "Christopher", "Ashley", "Andrew", "Stephanie", "Joseph", "Nicole"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];
const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "Austin", "Miami", "Denver", "Seattle", "Portland", "Atlanta"];
const adjusters = ["A. Mitchell", "B. Cooper", "C. Reynolds", "D. Foster", "E. Hayes", "F. Brooks"];
const autoDescriptions = ["Rear-end collision at intersection", "Multi-vehicle highway accident", "Single vehicle rollover", "Parking lot fender bender", "Hit and run incident", "Vehicle theft claim", "Windshield damage from debris"];
const propertyDescriptions = ["Water damage from burst pipe", "Fire damage to kitchen", "Storm damage to roof", "Vandalism to property", "Theft of personal items", "Flooding in basement"];
const healthDescriptions = ["Emergency room visit", "Surgical procedure claim", "Extended hospital stay", "Specialist consultation", "Diagnostic imaging claim", "Prescription medication claim"];
const lifeDescriptions = ["Term life policy claim", "Whole life benefit claim", "Accidental death claim", "Critical illness benefit"];
const liabilityDescriptions = ["Slip and fall on property", "Product liability claim", "Professional negligence", "General liability incident"];

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateClaimNumber(index: number): string {
  return `CLM-${String(2024000 + index).padStart(7, "0")}`;
}

function getDescription(type: ClaimType): string {
  switch (type) {
    case "Auto": return pick(autoDescriptions);
    case "Property": return pick(propertyDescriptions);
    case "Health": return pick(healthDescriptions);
    case "Life": return pick(lifeDescriptions);
    case "Liability": return pick(liabilityDescriptions);
  }
}

function generateFlags(riskScore: number, hasPoliceReport: boolean, amount: number, daysBetween: number): string[] {
  const flags: string[] = [];
  if (!hasPoliceReport && amount > 10000) flags.push("No police report");
  if (amount > 50000) flags.push("High claim amount");
  if (daysBetween > 30) flags.push("Late filing");
  if (daysBetween < 1) flags.push("Same-day filing");
  if (riskScore > 70) flags.push("ML anomaly detected");
  if (riskScore > 80) flags.push("Multiple risk factors");
  return flags;
}

export function generateMockClaims(count: number = 500): Claim[] {
  const claims: Claim[] = [];
  const types: ClaimType[] = ["Auto", "Property", "Health", "Life", "Liability"];

  for (let i = 0; i < count; i++) {
    const type = pick(types);
    const isFraudulent = Math.random() < 0.15; // 15% fraud rate

    let amount: number;
    if (isFraudulent) {
      amount = Math.round(rand(15000, 150000));
    } else {
      amount = Math.round(rand(500, 50000));
    }

    const incidentDate = new Date(2024, Math.floor(rand(0, 12)), Math.floor(rand(1, 28)));
    const daysBetween = isFraudulent ? Math.floor(rand(0, 3)) : Math.floor(rand(1, 45));
    const filingDate = new Date(incidentDate.getTime() + daysBetween * 86400000);

    const hasPoliceReport = isFraudulent ? Math.random() < 0.3 : Math.random() < 0.8;

    const ruleScore = Math.round(
      (isFraudulent ? rand(40, 90) : rand(5, 45)) +
      (!hasPoliceReport ? 10 : 0) +
      (amount > 50000 ? 15 : 0) +
      (daysBetween < 2 ? 10 : 0)
    );

    const mlScore = Math.round(isFraudulent ? rand(50, 95) : rand(5, 40));

    const riskScore = Math.min(100, Math.round(ruleScore * 0.4 + mlScore * 0.4 + rand(0, 20)));

    const riskLevel: RiskLevel = riskScore >= 70 ? "High" : riskScore >= 40 ? "Medium" : "Low";

    const statusOptions: ClaimStatus[] = riskLevel === "High"
      ? ["Flagged", "Under Review", "Denied"]
      : riskLevel === "Medium"
      ? ["Under Review", "Open", "Flagged"]
      : ["Open", "Closed", "Under Review"];

    claims.push({
      id: `claim-${i}`,
      claimNumber: generateClaimNumber(i),
      policyHolder: `${pick(firstNames)} ${pick(lastNames)}`,
      type,
      amount,
      filingDate: filingDate.toISOString().split("T")[0],
      incidentDate: incidentDate.toISOString().split("T")[0],
      status: pick(statusOptions),
      riskScore,
      riskLevel,
      ruleScore: Math.min(100, ruleScore),
      mlScore,
      hasPoliceReport,
      description: getDescription(type),
      location: pick(cities),
      adjuster: pick(adjusters),
      flags: generateFlags(riskScore, hasPoliceReport, amount, daysBetween),
    });
  }

  return claims.sort((a, b) => b.riskScore - a.riskScore);
}

export function getStats(claims: Claim[]) {
  const total = claims.length;
  const flagged = claims.filter(c => c.riskLevel === "High").length;
  const underReview = claims.filter(c => c.status === "Under Review" || c.status === "Flagged").length;
  const avgRisk = Math.round(claims.reduce((sum, c) => sum + c.riskScore, 0) / total);
  const totalExposure = claims.filter(c => c.riskLevel === "High").reduce((sum, c) => sum + c.amount, 0);
  const byType = claims.reduce((acc, c) => {
    acc[c.type] = (acc[c.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const byRisk = claims.reduce((acc, c) => {
    acc[c.riskLevel] = (acc[c.riskLevel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const byMonth = claims.reduce((acc, c) => {
    const month = c.filingDate.substring(0, 7);
    if (!acc[month]) acc[month] = { total: 0, flagged: 0 };
    acc[month].total++;
    if (c.riskLevel === "High") acc[month].flagged++;
    return acc;
  }, {} as Record<string, { total: number; flagged: number }>);

  return { total, flagged, underReview, avgRisk, totalExposure, byType, byRisk, byMonth };
}
