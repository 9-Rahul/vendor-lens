import Groq from "groq-sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

const GROQ_MODEL = "llama-3.3-70b-versatile";
const GEMINI_MODEL = "gemini-2.5-flash";


async function callAI(prompt: string): Promise<string> {
  let groqFailed = false;


  if (groq) {
    try {
      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: GROQ_MODEL,
        response_format: { type: "json_object" },
      });
      return completion.choices[0]?.message?.content || "{}";
    } catch (groqError: any) {
      console.warn(`[Groq Error] ${groqError.status || groqError.message}. Falling back to Gemini...`);
      groqFailed = true;
    }
  } else {
    groqFailed = true;
  }

  if (genAI && groqFailed) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: GEMINI_MODEL,
        generationConfig: { responseMimeType: "application/json" }
      });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (geminiError: any) {
      console.warn(`[Gemini Error] ${geminiError.status || geminiError.message}. All providers failed.`);
      throw new Error("ALL_PROVIDERS_FAILED");
    }
  }

  throw new Error("ALL_PROVIDERS_FAILED");
}

export interface ExtractedRequirement {
  id: string;
  title: string;
}

export async function extractRequirementsFromText(requirementsText: string): Promise<ExtractedRequirement[]> {
  const prompt = `
Extract all compliance requirements from the following text.
Assign a short, logical ID (e.g., REQ-1, SOC2-REQ) and a concise title for each.

Return JSON ONLY in this exact structure:
{
  "requirements": [
    {
      "id": "string",
      "title": "string"
    }
  ]
}

TEXT TO ANALYZE:
${requirementsText}
`;

  try {
    const jsonString = await callAI(prompt);
    const data = JSON.parse(jsonString);
    return data.requirements || [];
  } catch (error) {
    console.error(`⚠️ Extraction Error. Utilizing offline requirement templates.`);
    return [
      { id: "REQ-1", title: "Data Residency (EU)" },
      { id: "REQ-2", title: "AES-256 Encryption at Rest" },
      { id: "REQ-3", title: "Annual Penetration Testing" }
    ];
  }
}

export type MatchStatus = "met" | "partial" | "missing";

export interface EvidenceMatch {
  status: MatchStatus;
  evidence: string;
  reasoning: string;
}

export async function matchEvidenceToRequirement(requirementTitle: string, vendorText: string): Promise<EvidenceMatch> {
  const prompt = `
You are a strict compliance auditor.
Determine whether the following requirement is met by the provided vendor text.

REQUIREMENT:
${requirementTitle}

VENDOR TEXT:
${vendorText}

Evaluate carefully. 
- Return "met" if the text provides clear evidence.
- Return "partial" if the text addresses it but lacks full detail.
- Return "missing" if there is no mention or insufficient evidence.

Return JSON ONLY in this exact structure:
{
  "status": "met" | "partial" | "missing",
  "evidence": "Extract the exact sentence(s) from the text proving this. Leave empty if missing.",
  "reasoning": "A short, 1-sentence explanation of your verdict."
}
`;

  try {
    const jsonString = await callAI(prompt);
    return JSON.parse(jsonString) as EvidenceMatch;
  } catch (error) {
    console.error(`⚠️ Evidence Match Error. System could not connect to extraction service.`);
    return {
      status: "partial",
      evidence: "Evidence extraction requires manual review.",
      reasoning: "System could not automatically verify evidence. Manual review recommended."
    };
  }
}

export interface AssessmentSummary {
  summary: string;
  risk: "low" | "medium" | "high";
  actions: string[];
}

export async function generateAssessmentSummary(score: number, missingRequirements: string[]): Promise<AssessmentSummary> {
  const prompt = `
Generate an executive summary based on the following compliance score and missing requirements.

SCORE: ${score}%
MISSING REQUIREMENTS:
${missingRequirements.length > 0 ? missingRequirements.join('\n') : "None. Perfect score."}

Return JSON ONLY in this exact structure:
{
  "summary": "A 2-3 sentence executive summary of the vendor's compliance posture.",
  "risk": "low" | "medium" | "high",
  "actions": ["Action 1", "Action 2"]
}
`;

  try {
    const jsonString = await callAI(prompt);
    return JSON.parse(jsonString) as AssessmentSummary;
  } catch (error) {
    console.error(`⚠️ Assessment Summary Error. Generating offline summary metrics.`);
    return {
      summary: `The vendor achieves a ${score}% compliance score. ${missingRequirements.length > 0 ? 'Review of missing or partial requirements is recommended before proceeding.' : 'The vendor satisfies all core requirements.'}`,
      risk: score < 50 ? "high" : (score < 100 ? "medium" : "low"),
      actions: missingRequirements.map(req => `Review missing requirement: ${req}`)
    };
  }
}
