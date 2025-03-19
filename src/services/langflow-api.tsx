import { ScanResponse } from './response-model';
import { ScanRequest } from './request-model';

const API_ENDPOINT = 'http://127.0.0.1:7860/api/v1/run/ba8d1886-8f1f-45a9-a778-5526ba589676';
const API_KEY = "sk-scPI6HSPmnZzn7qOlrP-i7n2pkQTjLoqgtHSACCujgA";

export async function scanText(input: string): Promise<ScanResponse> {
  try {
    const request: ScanRequest = {
      input_value: input, 
      output_type: "text",
      input_type: "text",
      tweaks: {
        "Prompt-Wu9zG": {},
        "TextInput-1xkIp": {},
        "OllamaModel-kmzJQ": {},
        "TextOutput-wEhz4": {}
      }
    };

    const response = await fetch(`${API_ENDPOINT}?stream=false`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "x-api-key": API_KEY
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Error calling Langflow API:', error);
    return { 
      data: {
        session_id: '',
        outputs: []
      },
      error: error instanceof Error ? error.message : 'An unknown error occurred in API call' 
    };
  }
}