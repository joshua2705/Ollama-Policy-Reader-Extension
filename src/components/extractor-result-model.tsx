export interface ExtractionResult {
    success: boolean;
    rawText: string;
    formattedSections?: { title: string; content: string }[];
    url?: string;
    title?: string;
    extractedFrom?: string | null;
    timestamp?: string;
    message?: string;
    error?: unknown;
  }