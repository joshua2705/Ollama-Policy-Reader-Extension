export interface ScanResponse {
    data: Session;
    error?: string;
}

interface Session {
    session_id: string;
    outputs: Output[];
}

interface Output {
    inputs: InputData;
    outputs: ProcessedOutput[];
}

interface InputData {
    input_value: string;
}

interface ProcessedOutput {
    results: Result;
    artifacts: Artifact;
    outputs: MessageOutput;
    logs: Log;
    messages: Message[];
    component_display_name: string;
    component_id: string;
    used_frozen_result: boolean;
}

interface Result {
    text: TextData;
}

interface Artifact {
    text: ArtifactText;
}

interface MessageOutput {
    text: MessageContent;
}

interface Log {
    text: string[];
}

interface Message {
    message: string;
    sender: string | null;
    sender_name: string | null;
    session_id: string;
    component_id: string;
    files: any[];
    type: string;
}

interface TextData {
    text_key: string;
    data: TextContent;
    default_value: string;
    text: string;
    sender: string | null;
    sender_name: string | null;
    files: any[];
    session_id: string;
    timestamp: string;
    flow_id: string;
    error: boolean;
    edit: boolean;
    properties: Properties;
    category: string;
    content_blocks: any[];
}

interface TextContent {
    text: string;
    files: any[];
    timestamp: string;
    flow_id: string;
}

interface Properties {
    text_color: string | null;
    background_color: string | null;
    edited: boolean;
    source: Source;
    icon: string | null;
    allow_markdown: boolean;
    state: string;
    targets: any[];
}

interface Source {
    id: string | null;
    display_name: string | null;
    source: string | null;
}

interface ArtifactText {
    repr: string;
    raw: string;
    type: string;
}

interface MessageContent {
    message: string;
    type: string;
}
