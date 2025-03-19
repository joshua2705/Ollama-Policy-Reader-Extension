import { useEffect, useState } from 'react';
import { Scan } from 'lucide-react';
import styles from './Scanner.module.css';
import { scanText } from '../services/langflow-api';
import { ScanResponse } from '../services/response-model';
//import { analyzeTermsAndConditions } from './Extractor';
import { extractTermsAndConditions } from './Extractor';
import { ExtractionResult } from './extractor-result-model';

console.log('Scanner component loaded');

export function Scanner() {
  console.log('Scanner component rendering');
  
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   console.log('Scanner component mounted');
  //   const element = document.querySelector('.policy-scanner-container');
  //   if (element) {
  //     console.log('Scanner container styles:', window.getComputedStyle(element));
  //   } else {
  //     console.log('Scanner container not found in DOM');
  //   }
  //   return () => console.log('Scanner component unmounted');
  // }, []);

  let extract: ExtractionResult;

  extractTermsAndConditions(50000)
      .then(result => {extract = result})
      .catch(error => console.log("error in reading",error));
  
  const scanPage = async () => {
    console.log('Scan initiated');
    setScanning(true);
    setError(null);

    try {
      //const testData = 'Give 3 points on the most important privacy policy discrepancies as bullet points with "-" for bullet. Make each point no more than 20 words.';
      console.log('Sending data to API:', extract.rawText);
      
      const response: ScanResponse = await scanText(extract.rawText);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      console.log('Scan completed, results:', response.data);

      setResults(JSON.parse(response.data.outputs[0].outputs[0].outputs.text.message));

    } catch (error) {
      console.error('Error scanning page:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Policy Scanner</h2>
        <button
          onClick={scanPage}
          disabled={scanning}
          className={styles.button}
        >
          <Scan size={20} />
          {scanning ? 'Scanning...' : 'Scan Page'}
        </button>
      </div>
      
      {error && (
        <div className={styles.error}>
          <p>Error: {error}</p>
        </div>
      )}
      
      {results && (
        <div className={styles.results}>
          <h3 className={styles.resultsTitle}>Analysis Results:</h3>
          <pre className={styles.resultsContent}>
            <ul className={styles.resultsPoints}>
              {results.points.map((point: string) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </pre>
        </div>
      )}
    </div>
  );
}