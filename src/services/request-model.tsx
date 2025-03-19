export interface ScanRequest {
    input_value: string;
    output_type: "text";
    input_type: "text";
    tweaks: Record<string, object>;
  }