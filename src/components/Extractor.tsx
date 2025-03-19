import { ExtractionResult } from './extractor-result-model';
/**
 ** Terms and Conditions Extractor for Chrome Extension
 ** With timeout handling
 **/
// Function to extract the terms and conditions content with timeout
export function extractTermsAndConditions(timeoutMs: number = 5000): Promise<ExtractionResult> {

    return new Promise((resolve, reject) => {

    // Set timeout for extraction
      const timeoutId = setTimeout(() => {
        reject({
          success: false,
          message: `Extraction timed out after ${timeoutMs}ms`
        });
      }, timeoutMs);
  
      try {
        // 1. Try to identify the main content area using common selectors
        const potentialSelectors: string[] = [
            // Common containers for terms/legal content
          'main', 'article', '.content', '#content', '.main-content', '#main-content',
          '.terms', '#terms', '.terms-content', '#terms-content',
          '.legal', '#legal', '.legal-content', '#legal-content',
          '.terms-and-conditions', '#terms-and-conditions',
          '.tos', '#tos', '.terms-of-service', '#terms-of-service',
          '[aria-label*="terms"]', '[aria-label*="Terms"]',

          // Fallback to body if needed
          'body'
        ];
        
        let mainContent: Element | null = null;
        let usedSelector: string | null = null;
        
        // Try each selector until we find content
        for (const selector of potentialSelectors) {
          const element = document.querySelector(selector);
          if (element && element.textContent) {
            // Check if this element contains enough text to likely be the terms
            const text = element.textContent.trim();
            if (text.length > 500) {    // Minimum expected length for terms content
              mainContent = element;
              usedSelector = selector;
              break;
            }
          }
        }
        
        if (!mainContent) {
          clearTimeout(timeoutId);
          return resolve({ success: false, rawText: '', message: "Could not identify terms content container" });
        }
  
        // 2. Clean up the content by removing unnecessary elements
        // Create a clone to avoid modifying the actual DOM
        const contentClone = mainContent.cloneNode(true) as HTMLElement;
        
        // FIX: We need to use proper DOM methods on the clon
        const elementsToRemove: string[] = [
          'header', 'footer', 'nav', '.nav', '#nav', '.navigation', '#navigation',
          '.menu', '#menu', '.sidebar', '#sidebar', 'aside',
          '.ad', '.ads', '.advertisement', '.cookie-banner', '.cookie-notice',
          '.newsletter', '.subscribe', '.social-media', '.social-links',
          '.comment', '.comments', 'iframe', 'script', 'style'
        ];
        
        // Remove elements from the clone
        elementsToRemove.forEach(selector => {
          // We need to find all matching elements in the clone
          contentClone.querySelectorAll(selector).forEach(el => el.remove());
        });
        
        // 3. Extract and clean the text content
        let termsText: string = contentClone.textContent?.trim()
          // Remove excessive whitespace
          .replace(/\s+/g, ' ')
          // Remove any URLs
          .replace(/https?:\/\/[^\s]+/g, '[URL]') || '';
        
        // 4. Attempt to identify the beginning and end of the actual terms
        const startIndicators: string[] = [
          'Terms and Conditions', 'Terms of Service', 'Terms of Use',
          'User Agreement', 'Legal Terms', 'TERMS AND CONDITIONS',
          'TERMS OF SERVICE', 'TERMS OF USE'
        ];
        
        const endIndicators: string[] = [
          'Last updated', 'Last modified', 'Effective date',
          'Contact Us', 'Questions or concerns', 'How to contact us'
        ];
        
        // Find the start of the terms content
        let startIndex = 0;
        for (const indicator of startIndicators) {
          const index = termsText.indexOf(indicator);
          if (index !== -1) {
            startIndex = index;
            break;
          }
        }
        
        // Find the end of the terms content (if possible)
        let endIndex = termsText.length;
        for (const indicator of endIndicators) {
          const index = termsText.lastIndexOf(indicator);
          if (index !== -1 && index > startIndex) {
            endIndex = index;
            break;
          }
        }
        
        // Extract just the terms portion
        termsText = termsText.substring(startIndex, endIndex).trim();
        
        // 5. Structure the content by identifying sections
        const sections: { title: string; content: string }[] = [];
        const sectionHeadings: string[] = [
          'Introduction', 'Definitions', 'Account', 'User', 'Privacy', 'Content',
          'Restrictions', 'Copyright', 'Intellectual Property', 'Termination',
          'Limitation', 'Disclaimer', 'Governing Law', 'Changes', 'Contact'
        ];
        
        let currentSection = { title: 'General', content: '' };
        
        // Split text into paragraphs
        const paragraphs = termsText.split(/\n+/);
        
        for (const paragraph of paragraphs) {
          // Check if this paragraph is a section heading
          const isHeading = sectionHeadings.some(heading => 
            paragraph.includes(heading) && paragraph.length < 100
          );
          
          if (isHeading) {
            // Save previous section and start a new one
            if (currentSection.content.trim()) {
              sections.push(currentSection);
            }
            currentSection = { title: paragraph.trim(), content: '' };
          } else {
            // Add to current section
            currentSection.content += paragraph + '\n\n';
          }
        }
        
        // Add the last section
        if (currentSection.content.trim()) {
          sections.push(currentSection);
        }
        
        const result = {
          success: true,
          rawText: termsText,
          formattedSections: sections,
          url: window.location.href,
          title: document.title,
          extractedFrom: usedSelector,
          timestamp: new Date().toISOString()
        };
        
        // Clear the timeout and resolve
        clearTimeout(timeoutId);
        resolve(result);
      } catch (error) {
        clearTimeout(timeoutId);
        resolve({
          success: false,
          rawText: '',
          message: "Error extracting terms and conditions",
          error: error
        });
      }
    });
  }
  

export async function analyzeTermsAndConditions(timeoutMs: number = 5000) {
      try {
        const extractedTerms = await extractTermsAndConditions(timeoutMs);
        return extractedTerms;
        
      } catch (error) {
        return { 
          success: false, 
          message: "Error analyzing terms and conditions", 
          error: error
        };
      }
}