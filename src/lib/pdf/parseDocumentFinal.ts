export async function extractTextFromFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();

  if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
    try {
      const PDFParser = (await import("pdf2json")).default;
      
      return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser(null, true);
        
        pdfParser.on("pdfParser_dataError", (errData: any) => {
          reject(errData.parserError || errData);
        });

        pdfParser.on("pdfParser_dataReady", () => {
          const rawText = pdfParser.getRawTextContent();
          resolve(rawText);
        });

        pdfParser.parseBuffer(Buffer.from(arrayBuffer));
      });
    } catch (error) {
      console.error("Failed to parse PDF:", error);
      throw new Error(`Could not extract text from PDF: ${file.name}`);
    }
  }

  return Buffer.from(arrayBuffer).toString("utf-8");
}
