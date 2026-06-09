// @ts-ignore
const pdfParseModule = require("pdf-parse");
const pdfParse = pdfParseModule.default || pdfParseModule;

export async function extractTextFromFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Parse if it's a PDF
  if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
    try {
      const data = await pdfParse(buffer);
      return data.text;
    } catch (error) {
      console.error("Failed to parse PDF:", error);
      throw new Error(`Could not extract text from PDF: ${file.name}`);
    }
  }

  // Fallback for our text-based demo files
  return buffer.toString("utf-8");
}
