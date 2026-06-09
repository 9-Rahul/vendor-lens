import { NextResponse } from "next/server";
import { extractTextFromFile } from "@/lib/pdf/parseDocumentFinal";
import { extractRequirementsFromText, matchEvidenceToRequirement, generateAssessmentSummary } from "@/lib/ai/client";
import { calculateComplianceScore } from "@/lib/compliance/engine";
import { AssessmentData, Requirement } from "@/types/assessment";

function categorizeRequirement(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('data') || t.includes('privacy') || t.includes('legal') || t.includes('gdpr') || t.includes('residency')) return 'Legal';
  if (t.includes('server') || t.includes('cloud') || t.includes('network') || t.includes('infrastructure') || t.includes('architecture')) return 'Infrastructure';
  if (t.includes('soc2') || t.includes('iso') || t.includes('audit') || t.includes('compliance') || t.includes('cert')) return 'Compliance';
  return 'Security';
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    const requirements = formData.get("requirements") as File | null;
    const vendor = formData.get("vendor") as File | null;

    if (!requirements || !vendor) {
      return NextResponse.json(
        { error: "Missing required files: both requirements and vendor files are needed." },
        { status: 400 }
      );
    }

    console.log("=========================================");
    console.log("📦 NEW UPLOAD RECEIVED");
    console.log("=========================================");
    console.log(`📄 Requirements: ${requirements.name} (${(requirements.size / 1024).toFixed(2)} KB)`);
    console.log(`📁 Vendor: ${vendor.name} (${(vendor.size / 1024).toFixed(2)} KB)`);

    // Phase 2: PDF Text Extraction
    console.log("⏳ Extracting text from files...");
    const requirementsText = await extractTextFromFile(requirements);
    const vendorText = await extractTextFromFile(vendor);

    console.log("✅ Extraction Complete!");
    console.log("=========================================");
    console.log("📄 REQUIREMENTS TEXT (PREVIEW):");
    console.log(requirementsText.substring(0, 150) + "...");
    console.log("=========================================");
    console.log("📁 VENDOR TEXT (PREVIEW):");
    console.log(vendorText.substring(0, 150) + "...");
    console.log("=========================================\n");

    // Phase 4: Requirement Extraction
    console.log("⏳ Asking Gemini to extract structured requirements...");
    const extractedReqs = await extractRequirementsFromText(requirementsText);
    console.log("✅ Extracted", extractedReqs.length, "structured requirements!");

    // Phase 5: Evidence Matching
    console.log("⏳ Matching evidence for each requirement...");
    const frontendRequirements: Requirement[] = [];
    
    for (let i = 0; i < extractedReqs.length; i++) {
      const req = extractedReqs[i];
      // Sequentially match to avoid hitting rate limits instantly
      const match = await matchEvidenceToRequirement(req.title, vendorText);
      
      // Calculate Context for Phase 10 Evidence Viewer
      let contextStr = undefined;
      if (match.evidence) {
        // Simple heuristic: find the sentence in the text, then grab a chunk before and after
        const index = vendorText.indexOf(match.evidence);
        if (index !== -1) {
          const start = Math.max(0, index - 400);
          const end = Math.min(vendorText.length, index + match.evidence.length + 400);
          contextStr = vendorText.slice(start, end).replace(/\n{3,}/g, '\n\n'); // Normalize spacing
        }
      }

      frontendRequirements.push({
        id: req.id,
        code: req.id,
        category: categorizeRequirement(req.title),
        title: req.title,
        description: `Ensure the vendor satisfies: ${req.title}`,
        status: match.status,
        evidence: match.evidence ? [{
          id: `ev-${i}`,
          sourceDocument: "Vendor Upload",
          excerpt: match.evidence,
          context: contextStr,
          type: "pdf",
          pageNumber: 1
        }] : [],
        assessment: {
          summary: match.reasoning || "Evaluation complete.",
          action: match.status === "missing" ? "Request clarification from vendor." : "No action required."
        }
      });
    }

    // Phase 6: Compliance Engine
    console.log("🧮 Calculating compliance score...");
    const finalScore = calculateComplianceScore(frontendRequirements);
    console.log("✅ Final Score calculated:", finalScore);
    
    // Phase 7: Assessment Generation
    console.log("⏳ Asking Gemini to generate executive summary...");
    const missingTitles = frontendRequirements.filter(r => r.status === "missing").map(r => r.title);
    const summaryData = await generateAssessmentSummary(finalScore, missingTitles);
    console.log("✅ Assessment generated!");
    
    console.log("=========================================\n");

    const metCount = frontendRequirements.filter(r => r.status === "met").length;
    const partialCount = frontendRequirements.filter(r => r.status === "partial").length;
    const missingCount = frontendRequirements.filter(r => r.status === "missing").length;

    // Map risk to status
    const statusMap = {
      "low": "approved",
      "medium": "review_required",
      "high": "rejected"
    } as const;

    // Assemble final structured response exactly as the frontend types expect
    const finalAssessment: AssessmentData = {
      id: "assmnt-" + Date.now(),
      vendorName: "Analyzed Vendor",
      frameworkName: "Extracted Framework",
      summary: summaryData.summary,
      status: statusMap[summaryData.risk] || "review_required",
      stats: {
        evaluated: extractedReqs.length,
        met: metCount,
        partial: partialCount,
        missing: missingCount
      },
      actions: summaryData.actions || [],
      requirements: frontendRequirements
    };

    return NextResponse.json({ 
      received: true,
      assessment: finalAssessment
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to process upload" },
      { status: 500 }
    );
  }
}
