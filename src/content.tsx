import { createRoot } from 'react-dom/client';
import { Scanner } from './components/Scanner';
import styles from './content.module.css';

console.log('Content script starting...');

// Prevent PWA install prompt
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
});

// Create container for the scanner UI
const container = document.createElement('div');
container.id = 'policy-scanner-root';
container.className = styles.container;
document.body.appendChild(container);

console.log('Container created:', container);
console.log('Container styles:', window.getComputedStyle(container));

// Mount React component
try {
  createRoot(container).render(<Scanner />);
  console.log('Scanner component mounted successfully');
} catch (error) {
  console.error('Error mounting Scanner component:', error);
}


// Content script to detect terms & conditions or privacy policy pages
document.addEventListener("DOMContentLoaded", () => {
  // List of keywords commonly found in legal pages
  const keywords: string[] = [
      "terms of service",
      "terms and conditions",
      "privacy policy",
      "user agreement",
      "data policy",
      "legal agreement",
      "cookie policy"
  ];

  /**
   * Function to check if the page contains legal-related text
   * @returns {boolean} - True if legal content is found, false otherwise
   */
  const isLegalPage = (): boolean => {
      // Check the document title
      const pageTitle: string = document.title.toLowerCase();
      if (keywords.some(keyword => pageTitle.includes(keyword))) {
          return true;
      }

      // Check headings (h1, h2, h3)
      const headings = document.querySelectorAll("h1, h2, h3");
      for (let heading of headings) {
          if (keywords.some(keyword => heading.textContent?.toLowerCase().includes(keyword))) {
              return true;
          }
      }

      // Check the body text (limit to 5000 characters for performance)
      const bodyText: string = document.body.innerText.toLowerCase().substring(0, 5000);
      if (keywords.some(keyword => bodyText.includes(keyword))) {
          return true;
      }

      return false;
  };

  // If legal terms are found, notify the background script
  if (isLegalPage()) {
      console.log("🚨 Legal page detected!");
      chrome.runtime.sendMessage({ found: true });
  }
});
