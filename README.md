# Policy Reader Chrome Extension

## Overview

The **Policy Reader** is a Chrome extension that reads privacy policy webpages and highlights potential concerns for users. It leverages **Ollama 3.2**, orchestrated by **Langflow**, to analyze policy texts and detect misleading or shady clauses.

The extension is built using **React**, **TypeScript**, and **Vite**.

## Features

- **Privacy Policy Analysis**: Reads and highlights key issues in policy documents.
- **Ollama 3.2 & Langflow Integration**: Uses AI to provide insights into policies.
- **Chrome & Edge Support**: Works as an unpacked extension in Chromium-based browsers.

## Setup Instructions

### 1. Install Ollama 3.2

Ollama is required for running the AI model locally.

#### Steps to Install Ollama:

1. Download and install Ollama from [Ollama's official website](https://ollama.com/).
2. Verify the installation by running:
   ```sh
   ollama --version
   ```
3. Pull the required model:
   ```sh
   ollama pull <model-name>
   ```

### 2. Set Up Langflow

Langflow orchestrates the AI model to process policy documents efficiently.

#### Steps to Set Up Langflow:

1. Install Langflow using pip:
   ```sh
   pip install langflow
   ```
2. Run Langflow:
   ```sh
   langflow run
   ```
3. Open the Langflow UI (default: `http://localhost:7860`).
4. **Import the flow**:
   - Upload `PolicyScannerFlow.json` into Langflow to load the predefined flow.
5. **Configure API Path**:
   - In the `langflow-api.ts` file under the `service` folder of the extension, update the API path to match your local Langflow API:
     ```typescript
     const LANGFLOW_API_URL = "http://localhost:7860/api"; // Update if needed
     ```

### 3. Install & Build the Chrome Extension

The extension is built using React and TypeScript with Vite.

#### Steps to Install Dependencies:

1. Navigate to the project directory:
   ```sh
   cd policy-reader-extension
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

#### Steps to Build:

1. Run the following command to build the project:
   ```sh
   npm run build
   ```
2. This will generate a `dist/` folder, which contains the extension files.

### 4. Load the Extension in Chrome/Edge

1. Open Chrome and go to `chrome://extensions/` (for Edge, go to `edge://extensions/`).
2. Enable **Developer Mode** (toggle in the top-right corner).
3. Click **Load Unpacked** and select the `dist/` folder.
4. The extension should now be available in your browser!

## Final Result

(Space for screenshots and final output images)

---

### Contributions & Feedback

Feel free to contribute, suggest improvements, or report issues via GitHub!

---

**License:** [MIT License](LICENSE)

