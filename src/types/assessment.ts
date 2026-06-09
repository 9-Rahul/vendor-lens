export type AssessmentStatus = "review_required" | "approved" | "rejected";
export type RequirementStatus = "met" | "partial" | "missing";
export type AppState = "upload" | "processing" | "results" | "error";

export interface Evidence {
  id: string;
  sourceDocument: string;
  pageNumber?: string | number;
  date?: string;
  excerpt: string;
  type: "pdf" | "email" | "doc" | "other";
  context?: string;
}

export interface Requirement {
  id: string;
  code: string;
  category: string;
  title: string;
  status: RequirementStatus;
  description: string;
  evidence: Evidence[];
  assessment: {
    summary: string;
    action?: string;
  };
}

export interface AssessmentData {
  id: string;
  vendorName: string;
  frameworkName: string;
  status: AssessmentStatus;
  summary: string;
  stats: {
    evaluated: number;
    met: number;
    partial: number;
    missing: number;
  };
  actions: string[];
  requirements: Requirement[];
}
