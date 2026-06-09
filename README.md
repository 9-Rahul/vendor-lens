# VendorLens

**Verify Vendors in Seconds.**

VendorLens is a professional procurement decision-support workspace that automates the tedious process of reviewing vendor compliance documents. Simply upload your requirements and the vendor's documentation, and VendorLens will instantly highlight exactly what's missing, partial, or fully met.

## Features

- **Instant Document Analysis**: Automatically cross-references vendor documents against your specific security and compliance requirements.
- **Decision-First Workspace**: Answers four key questions immediately: Can this vendor be approved? What failed? Why? What's next?
- **AI-Powered Resilience**: Utilizes an automated cascading LLM pipeline (Llama 3.3 70B via Groq with a Gemini 2.5 Flash fallback) to ensure reliable, fast extractions.
- **Zero-Dependency PDF Export**: Generate clean, professional compliance reports straight from the browser.

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/vendor-lens.git
   cd vendor-lens
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory and add your API keys:
   ```env
   GROQ_API_KEY=your_groq_api_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the App:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **AI Integration**: Groq SDK (Llama 3.3 70B), Google Generative AI (Gemini 2.5 Flash)
- **PDF Processing**: `pdf2json` (Server-side extraction)
- **State Management**: TanStack React Query
