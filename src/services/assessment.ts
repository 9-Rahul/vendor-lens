import { AssessmentData } from "@/types/assessment";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function uploadRequirementsFile(file: File): Promise<{ success: boolean }> {
  await delay(1500);
  if (file.size > 50 * 1024 * 1024) throw new Error("File too large");
  return { success: true };
}

export async function uploadVendorFile(file: File): Promise<{ success: boolean }> {
  await delay(2000);
  if (file.size > 50 * 1024 * 1024) throw new Error("File too large");
  return { success: true };
}

export async function analyzeDocuments(reqFile: File, vendorFile: File): Promise<AssessmentData> {
  const formData = new FormData();
  formData.append("requirements", reqFile);
  formData.append("vendor", vendorFile);

  const response = await fetch("/api/analyze", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to send files to the backend analysis pipeline.");
  }

  const data = await response.json();
  
  if (!data.assessment) {
    throw new Error("Backend did not return assessment data.");
  }

  console.log("🚀 Real AI Assessment Generated:", data.assessment);
  
  return data.assessment;
}



export async function exportAssessment(data: AssessmentData): Promise<{ success: boolean }> {

  const missingReqs = data.requirements.filter(r => r.status === "missing");
  const score = Math.round((data.stats.met + (data.stats.partial * 0.5)) / data.stats.evaluated * 100) || 0;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>VendorLens_Assessment</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; padding: 40px; color: #1a1a1a; max-width: 800px; margin: 0 auto; }
        h1 { border-bottom: 2px solid #eaeaea; padding-bottom: 10px; margin-bottom: 5px; }
        .meta { color: #666; margin-bottom: 30px; font-size: 14px; }
        .section { margin-top: 30px; }
        h2 { font-size: 18px; margin-top: 30px; color: #333; border-bottom: 1px solid #eaeaea; padding-bottom: 5px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px; }
        th, td { border: 1px solid #eaeaea; padding: 10px; text-align: left; vertical-align: top; }
        th { background: #f8f9fa; font-weight: 600; }
        .met { color: #059669; font-weight: bold; }
        .partial { color: #d97706; font-weight: bold; }
        .missing { color: #dc2626; font-weight: bold; }
        @media print {
          body { padding: 0; }
          button { display: none; }
        }
      </style>
    </head>
    <body>
      <h1>VendorLens Compliance Assessment</h1>
      <div class="meta">
        <p><strong>Vendor:</strong> ${data.vendorName} &nbsp;|&nbsp; <strong>Framework:</strong> ${data.frameworkName} &nbsp;|&nbsp; <strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        <p><strong>Overall Score:</strong> ${score}% &nbsp;|&nbsp; <strong>Status:</strong> ${data.status.toUpperCase().replace('_', ' ')}</p>
      </div>
      
      <div class="section">
        <h2>Executive Summary</h2>
        <p>${data.summary}</p>
      </div>

      <div class="section">
        <h2>Missing Requirements & Recommendations</h2>
        ${missingReqs.length > 0 ? `
          <ul>
            ${missingReqs.map(r => `<li><strong>${r.title}:</strong> Request clarification or additional evidence from vendor.</li>`).join('')}
          </ul>
        ` : '<p>No missing requirements. The vendor meets all compliance criteria.</p>'}
      </div>

      <div class="section">
        <h2>Detailed Findings</h2>
        <table>
          <tr>
            <th width="30%">Requirement</th>
            <th width="15%">Status</th>
            <th width="55%">Evidence Excerpt</th>
          </tr>
          ${data.requirements.map(r => `
            <tr>
              <td><strong>${r.code}</strong><br/>${r.title}</td>
              <td class="${r.status}">${r.status.toUpperCase()}</td>
              <td style="font-family: monospace; font-size: 11.5px; background: #f8f9fa; padding: 8px; border-radius: 4px;">
                ${r.evidence[0]?.excerpt || 'No evidence found.'}
              </td>
            </tr>
          `).join('')}
        </table>
      </div>
      
      <script>
        window.onload = function() {
          window.print();
        }
      </script>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  } else {
    throw new Error("Popup blocked. Please allow popups to export the report.");
  }

  return { success: true };
}
