// Phase 6 - Compliance Engine
// Pure TypeScript deterministic logic

export function calculateComplianceScore(requirements: { status: string }[]): number {
  if (!requirements || requirements.length === 0) return 0;
  
  let totalScore = 0;
  
  for (const req of requirements) {
    if (req.status === "met") {
      totalScore += 1;
    } else if (req.status === "partial") {
      totalScore += 0.5;
    }
    // missing = 0
  }
  
  // Calculate percentage
  const percentage = (totalScore / requirements.length) * 100;
  
  // Return rounded whole number
  return Math.round(percentage);
}
