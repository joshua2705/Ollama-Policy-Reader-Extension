// /**
//  * Terms and Conditions Extractor for Chrome Extension
//  * With timeout handling and caching support
//  */

// // Cache object to store previously extracted terms
// const termsCache = {};

// // Function to extract the terms and conditions content with timeout
// function extractTermsAndConditions(timeoutMs = 5000) {
//   return new Promise((resolve, reject) => {
//     // Check cache first
//     const cacheKey = window.location.href;
//     if (termsCache[cacheKey]) {
//       console.log("Using cached terms data");
//       return resolve(termsCache[cacheKey]);
//     }
    
//     // Set timeout for extraction
//     const timeoutId = setTimeout(() => {
//       reject({ 
//         success: false, 
//         message: "Extraction timed out after " + timeoutMs + "ms" 
//       });
//     }, timeoutMs);
    
//     try {
//       // 1. Try to identify the main content area using common selectors
//       const potentialSelectors = [
//         // Common containers for terms/legal content
//         'main', 'article', '.content', '#content', '.main-content', '#main-content',
//         '.terms', '#terms', '.terms-content', '#terms-content',
//         '.legal', '#legal', '.legal-content', '#legal-content',
//         '.terms-and-conditions', '#terms-and-conditions',
//         '.tos', '#tos', '.terms-of-service', '#terms-of-service',
//         '[aria-label*="terms"]', '[aria-label*="Terms"]',
        
//         // Fallback to body if needed
//         'body'
//       ];
      
//       let mainContent = null;
//       let usedSelector = null;
      
//       // Try each selector until we find content
//       for (const selector of potentialSelectors) {
//         const element = document.querySelector(selector);
//         if (element) {
//           // Check if this element contains enough text to likely be the terms
//           const text = element.textContent.trim();
//           if (text.length > 500) { // Minimum expected length for terms content
//             mainContent = element;
//             usedSelector = selector;
//             break;
//           }
//         }
//       }
      
//       if (!mainContent) {
//         clearTimeout(timeoutId);
//         return resolve({ success: false, message: "Could not identify terms content container" });
//       }
      
//       // 2. Clean up the content by removing unnecessary elements
//       // Create a clone to avoid modifying the actual DOM
//       const contentClone = mainContent.cloneNode(true);
      
//       // FIX: We need to use proper DOM methods on the clone
//       const elementsToRemove = [
//         'header', 'footer', 'nav', '.nav', '#nav', '.navigation', '#navigation',
//         '.menu', '#menu', '.sidebar', '#sidebar', 'aside',
//         '.ad', '.ads', '.advertisement', 
//         '.cookie-banner', '.cookie-notice',
//         '.newsletter', '.subscribe',
//         '.social-media', '.social-links',
//         '.comment', '.comments',
//         'iframe', 'script', 'style'
//       ];
      
//       // Properly remove elements from the clone
//       elementsToRemove.forEach(selector => {
//         // We need to find all matching elements in the clone
//         const elements = contentClone.querySelectorAll(selector);
//         elements.forEach(el => {
//           if (el.parentNode) {
//             el.parentNode.removeChild(el);
//           }
//         });
//       });
      
//       // 3. Extract and clean the text content
//       let termsText = contentClone.textContent.trim()
//         // Remove excessive whitespace
//         .replace(/\s+/g, ' ')
//         // Remove any URLs
//         .replace(/https?:\/\/[^\s]+/g, '[URL]');
      
//       // 4. Attempt to identify the beginning and end of the actual terms
//       const startIndicators = [
//         'Terms and Conditions', 'Terms of Service', 'Terms of Use',
//         'User Agreement', 'Legal Terms', 'TERMS AND CONDITIONS',
//         'TERMS OF SERVICE', 'TERMS OF USE'
//       ];
      
//       const endIndicators = [
//         'Last updated', 'Last modified', 'Effective date',
//         'Contact Us', 'Questions or concerns', 'How to contact us'
//       ];
      
//       // Find the start of the terms content
//       let startIndex = 0;
//       for (const indicator of startIndicators) {
//         const index = termsText.indexOf(indicator);
//         if (index !== -1) {
//           startIndex = index;
//           break;
//         }
//       }
      
//       // Find the end of the terms content (if possible)
//       let endIndex = termsText.length;
//       for (const indicator of endIndicators) {
//         const index = termsText.lastIndexOf(indicator);
//         if (index !== -1 && index > startIndex) {
//           endIndex = index;
//           break;
//         }
//       }
      
//       // Extract just the terms portion
//       termsText = termsText.substring(startIndex, endIndex).trim();
      
//       // 5. Structure the content by identifying sections
//       const sections = [];
//       const sectionHeadings = [
//         'Introduction', 'Definitions', 'Account', 'User', 'Privacy', 'Content',
//         'Restrictions', 'Copyright', 'Intellectual Property', 'Termination',
//         'Limitation', 'Disclaimer', 'Governing Law', 'Changes', 'Contact'
//       ];
      
//       let currentSection = { title: 'General', content: '' };
      
//       // Split text into paragraphs
//       const paragraphs = termsText.split(/\n+/);
      
//       for (const paragraph of paragraphs) {
//         // Check if this paragraph is a section heading
//         const isHeading = sectionHeadings.some(heading => 
//           paragraph.includes(heading) && paragraph.length < 100
//         );
        
//         if (isHeading) {
//           // Save previous section and start a new one
//           if (currentSection.content.trim()) {
//             sections.push(currentSection);
//           }
//           currentSection = { title: paragraph.trim(), content: '' };
//         } else {
//           // Add to current section
//           currentSection.content += paragraph + '\n\n';
//         }
//       }
      
//       // Add the last section
//       if (currentSection.content.trim()) {
//         sections.push(currentSection);
//       }
      
//       const result = {
//         success: true,
//         rawText: termsText,
//         formattedSections: sections,
//         url: window.location.href,
//         title: document.title,
//         extractedFrom: usedSelector,
//         timestamp: new Date().toISOString()
//       };
      
//       // Store in cache
//       termsCache[cacheKey] = result;
      
//       // Clear the timeout and resolve
//       clearTimeout(timeoutId);
//       resolve(result);
      
//     } catch (error) {
//       clearTimeout(timeoutId);
//       resolve({
//         success: false,
//         message: "Error extracting terms and conditions",
//         error: error.message
//       });
//     }
//   });
// }

// // Function to highlight potentially problematic clauses
// function highlightProblematicClauses(termsData) {
//   if (!termsData.success) return termsData;
  
//   const problematicClauses = [];
//   const redFlags = [
//     // Data collection and privacy
//     { pattern: /\b(collect|gathering|store|retain|use|share|sell)\b.{0,30}\b(data|information|personal|browsing|location)\b/i, 
//       category: "Data Collection" },
    
//     // Rights claiming
//     { pattern: /(perpetual|irrevocable|worldwide|royalty-free|transferable|sublicensable).{0,30}(license|right)/i, 
//       category: "Rights Claims" },
    
//     // Liability limitations
//     { pattern: /\b(not liable|no liability|limitation of liability|waive|disclaim|indemnify)\b/i, 
//       category: "Liability Limitations" },
    
//     // Unilateral changes
//     { pattern: /\b(right to|may|can).{0,20}\b(change|modify|update|amend|revise).{0,30}\b(term|agreement|policy|provision)\b/i, 
//       category: "Unilateral Changes" },
    
//     // Mandatory arbitration
//     { pattern: /\b(arbitration|arbitrate|dispute resolution)\b/i, 
//       category: "Arbitration Clause" },
    
//     // Class action waivers
//     { pattern: /\b(class action|class-wide|representative proceeding).{0,20}\b(waive|waiver|release)\b/i, 
//       category: "Class Action Waiver" },
    
//     // Termination without notice
//     { pattern: /\b(terminate|suspension|discontinue).{0,30}\b(without|no).{0,10}\b(notice|reason|cause)\b/i, 
//       category: "No-Notice Termination" }
//   ];
  
//   // Check each section for problematic clauses
//   termsData.formattedSections.forEach(section => {
//     for (const redFlag of redFlags) {
//       const matches = [...section.content.matchAll(redFlag.pattern)];
//       matches.forEach(match => {
//         problematicClauses.push({
//           category: redFlag.category,
//           text: match[0],
//           context: section.content.substring(
//             Math.max(0, match.index - 50),
//             Math.min(section.content.length, match.index + match[0].length + 50)
//           ),
//           sectionTitle: section.title
//         });
//       });
//     }
//   });
  
//   // Add the problematic clauses to the result
//   termsData.problematicClauses = problematicClauses;
  
//   return termsData;
// }

// // Main function to extract and analyze terms with cache support
// async function analyzeTermsAndConditions(options = {}) {
//   const { 
//     timeoutMs = 5000, 
//     forceRefresh = false,
//     cacheExpiryMs = 86400000 // 24 hours by default
//   } = options;
  
//   try {
//     // Check if we should use cache
//     const cacheKey = window.location.href;
//     const cachedData = termsCache[cacheKey];
    
//     if (!forceRefresh && cachedData) {
//       // Check if cache has expired
//       const timestamp = new Date(cachedData.timestamp).getTime();
//       const now = new Date().getTime();
//       const cacheAge = now - timestamp;
      
//       if (cacheAge < cacheExpiryMs) {
//         console.log(`Using cached terms data (${Math.round(cacheAge/1000/60)} minutes old)`);
//         return highlightProblematicClauses(cachedData);
//       } else {
//         console.log("Cache expired, refreshing terms data");
//       }
//     }
    
//     // Extract fresh data
//     const extractedTerms = await extractTermsAndConditions(timeoutMs);
//     const analyzedTerms = highlightProblematicClauses(extractedTerms);
//     return analyzedTerms;
    
//   } catch (error) {
//     return { 
//       success: false, 
//       message: "Error analyzing terms and conditions", 
//       error: error.toString() 
//     };
//   }
// }

// // Cache management functions
// function clearTermsCache() {
//   Object.keys(termsCache).forEach(key => delete termsCache[key]);
//   return { success: true, message: "Cache cleared" };
// }

// function getCacheStatus() {
//   return {
//     cacheEntries: Object.keys(termsCache).length,
//     cachedUrls: Object.keys(termsCache),
//     cacheSize: JSON.stringify(termsCache).length
//   };
// }

// // Example of how to use in a Chrome extension content script
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.action === "extractTerms") {
//     analyzeTermsAndConditions(request.options || {})
//       .then(result => sendResponse(result))
//       .catch(error => sendResponse({ 
//         success: false, 
//         message: "Error in extraction process", 
//         error: error.toString() 
//       }));
//     return true; // Indicates async response
//   } 
//   else if (request.action === "clearCache") {
//     sendResponse(clearTermsCache());
//     return true;
//   }
//   else if (request.action === "getCacheStatus") {
//     sendResponse(getCacheStatus());
//     return true;
//   }
// });

// // For testing in console
// // analyzeTermsAndConditions({forceRefresh: true}).then(console.log);