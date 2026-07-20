// =====================================================
// COMPLETE JOBSTREET SCRAPER - YOUR EXACT N8N CODE
// Converted to standalone local Puppeteer script
// =====================================================

const puppeteer = require('puppeteer');
const fs = require('fs');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function completeJobStreetScraper() {
  console.log('==============================================');
  console.log('🔍 JOBSTREET COMPLETE SCRAPER');
  console.log('==============================================\n');
  
  // ===== CONFIGURATION (Replace with your values) =====
  const CONFIG = {
    jobStreetLink: 'https://my.employer.seek.com/candidates/?jobid=89521509',
    loginEmail: 'talent@bigbath.com.my',
    loginPassword: 'CultureBB@2424',
    accountName: 'Big Bath Sdn Bhd',
    accountId: '62108082',
    companyName: 'Big Bath Sdn Bhd',
    
    // Job details (for output)
    jobRole: 'Content Creator',
    jobId: '89521509',
    employmentType: 'Full-time',
    jobDescription: '',
    jobResponsibility: '',
    companyCulture: '',
    additionalRequirements: '',
    groupARequirements: '',
    groupBRequirements: '',
    groupCRequirements: '',
    groupDRequirements: ''
  };
  
  // ===== LOAD COOKIES (Optional) =====
  let previousCookies = null;
  try {
    const cookiesFile = fs.readFileSync('./test-cookies.json', 'utf8');
    previousCookies = JSON.parse(cookiesFile);
    console.log(`✅ Loaded ${previousCookies.length} cookies from file\n`);
  } catch (err) {
    console.log('⚠️  No cookies file found, will login manually\n');
  }
  
  // ===== LAUNCH BROWSER =====
  console.log('🚀 Launching browser...\n');
  const browser = await puppeteer.launch({
    headless: false,  // Set to true for production
    slowMo: 50,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1920,1080'
    ],
    defaultViewport: null
  });
  
  const page = await browser.newPage();
  
  // ===== YOUR EXACT N8N CODE STARTS HERE =====
  
  console.log('=== STEP 1: GET DATA FROM INPUT ===');
  
  const jobStreetLink = CONFIG.jobStreetLink;
  const loginEmail = CONFIG.loginEmail;
  const loginPassword = CONFIG.loginPassword;
  const accountName = CONFIG.accountName;
  const accountId = CONFIG.accountId;
  const companyName = CONFIG.companyName;
  
  // Validation
  if (!jobStreetLink || !jobStreetLink.includes('my.employer.seek.com')) {
    console.log('❌ Invalid jobStreetLink');
    await browser.close();
    return;
  }
  
  if (!loginEmail || !loginPassword) {
    console.log(`❌ Missing credentials for ${companyName}`);
    await browser.close();
    return;
  }
  
  if (!accountName || !accountId) {
    console.log(`❌ Missing JobStreet account info for ${companyName}`);
    await browser.close();
    return;
  }
  
  console.log(`✓ Company: ${companyName}`);
  console.log(`✓ Login Email: ${loginEmail}`);
  console.log(`✓ Account Name: ${accountName}`);
  console.log(`✓ Account ID: ${accountId}\n`);
  
  // Set User-Agent
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1920, height: 1080 });
  
  // ===== REUSE COOKIES FROM PREVIOUS JOB =====
  if (previousCookies && Array.isArray(previousCookies) && previousCookies.length > 0) {
    console.log('=== REUSING COOKIES FROM PREVIOUS JOB ===');
    
    await page.goto('https://my.employer.seek.com', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await sleep(1000);
    
    await page.setCookie(...previousCookies);
    console.log(`✓ Set ${previousCookies.length} cookies from previous job`);
    
    await page.reload({ waitUntil: 'domcontentloaded' });
    await sleep(2000);
    console.log('✓ Cookies activated - LOGIN SKIPPED!\n');
  } else {
    console.log('=== NO PREVIOUS COOKIES (FIRST JOB) ===\n');
  }
  
  // Navigate
  await page.goto(jobStreetLink, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await sleep(3000);
  
  let currentUrl = page.url();
  
  // ===== LOGIN =====
  if (currentUrl.includes('authenticate.seek.com')) {
    console.log('=== LOGGING IN ===');
    await page.waitForSelector('input[type="email"]', { visible: true, timeout: 10000 });
    await page.type('input[type="email"]', loginEmail, { delay: 50 });
    await sleep(500);
    
    await page.waitForSelector('input[type="password"]', { visible: true, timeout: 10000 });
    await page.type('input[type="password"]', loginPassword, { delay: 50 });
    
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => {}),
      page.click('button[type="submit"]')
    ]);
    
    await sleep(3000);
    currentUrl = page.url();
    console.log('✓ Login successful\n');
  }
  
  // ===== SELECT ACCOUNT =====
  if (currentUrl.includes('account/select')) {
    console.log('=== SELECTING ACCOUNT ===');
    await sleep(2000);
    
    const clicked = await page.evaluate((targetAccountName, targetAccountId) => {
      // METHOD 1: Try finding by ID attribute (most reliable)
      const linkById = document.querySelector(`a[id^="${targetAccountId}"]`);
      if (linkById) {
        console.log(`✓ Found account by ID attribute: ${targetAccountId}`);
        linkById.click();
        return true;
      }
      
      // METHOD 2: Try finding by href containing account ID
      const linkByHref = document.querySelector(`a[href*="${targetAccountId}"]`);
      if (linkByHref) {
        console.log(`✓ Found account by href containing ID: ${targetAccountId}`);
        linkByHref.click();
        return true;
      }
      
      // METHOD 3: Find link with account name AND verify ID is nearby
      const allLinks = Array.from(document.querySelectorAll('a'));
      for (let link of allLinks) {
        const linkText = link.textContent?.trim() || '';
        
        // Check if link contains the account name
        if (linkText.includes(targetAccountName)) {
          // Check if account ID is in the link's ID attribute
          if (link.id && link.id.includes(targetAccountId)) {
            console.log(`✓ Found account by name + ID attribute: ${targetAccountName}`);
            link.click();
            return true;
          }
          
          // Check if account ID is in the link's href
          if (link.href && link.href.includes(targetAccountId)) {
            console.log(`✓ Found account by name + href: ${targetAccountName}`);
            link.click();
            return true;
          }
          
          // Check if account ID appears in nearby text (within parent container)
          let parent = link.parentElement;
          for (let i = 0; i < 5; i++) {
            if (!parent) break;
            if ((parent.textContent || '').includes(targetAccountId)) {
              console.log(`✓ Found account by name + nearby ID: ${targetAccountName}`);
              link.click();
              return true;
            }
            parent = parent.parentElement;
          }
        }
      }
      
      console.log(`✗ Could not find account: ${targetAccountName} (ID: ${targetAccountId})`);
      return false;
    }, accountName, accountId);
    
    if (!clicked) {
      console.log(`❌ Account selection failed for: ${accountName} (ID: ${accountId})\n`);
      await sleep(30000);
      await browser.close();
      return;
    }
    
    await sleep(5000);
    console.log(`✓ Account selected: ${accountName} (ID: ${accountId})\n`);
  }
  
  // ===== SAVE COOKIES FOR NEXT JOB =====
  const savedCookies = await page.cookies();
  console.log(`✓ Saved ${savedCookies.length} cookies for next job\n`);
  
  // ===== LOAD JOB PAGE =====
  console.log('=== LOADING JOB PAGE ===');
  await sleep(3000);
  
  await page.evaluate(() => window.scrollTo(0, 500));
  await sleep(1000);
  await page.evaluate(() => window.scrollTo(0, 1000));
  await sleep(1000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(1000);
  
  // ===== EXTRACT NEW CANDIDATES COUNT =====
  console.log('=== EXTRACTING NEW CANDIDATES COUNT ===');
  const newCandidatesInfo = await page.evaluate(() => {
    // Try to find the "X new" text beside Inbox
    const inboxSpans = document.querySelectorAll('span._5r6dm10.ekdkwf2');
    
    for (let span of inboxSpans) {
      const text = span.textContent?.trim() || '';
      // Check if it matches "X new" pattern (e.g., "17 new")
      if (text.toLowerCase().includes('new')) {
        // Extract the number from "17 new"
        const match = text.match(/(\d+)\s*new/i);
        if (match && match[1]) {
          return {
            fullText: text,           // "17 new"
            count: parseInt(match[1]) // 17
          };
        }
      }
    }
    
    // Fallback: Try alternative selector
    const altSpan = document.querySelector('span[class*="_5r6dm10"][class*="ekdkwf2"]');
    if (altSpan) {
      const text = altSpan.textContent?.trim() || '';
      const match = text.match(/(\d+)\s*new/i);
      if (match && match[1]) {
        return {
          fullText: text,
          count: parseInt(match[1])
        };
      }
    }
    
    // If not found, return null
    return {
      fullText: '0 new',
      count: 0
    };
  });
  
  console.log(`✓ New candidates count: ${newCandidatesInfo.fullText} (${newCandidatesInfo.count} candidates)\n`);
  
  // ===== PROCESS ALL CANDIDATES =====
  const results = [];
  let currentPage = 1;
  let hasMorePages = true;
  
  while (hasMorePages) {
    console.log(`\n========== PAGE ${currentPage} ==========`);
    
    const resumeButtonsOnPage = await page.$$('button[aria-label="Resumé"]');
    const totalCandidates = resumeButtonsOnPage.length;
    
    console.log(`Found ${totalCandidates} candidates on page ${currentPage}`);
    
    for (let i = 0; i < totalCandidates; i++) {
      console.log(`\nProcessing candidate ${i + 1}/${totalCandidates}`);
      
      await page.evaluate((index) => window.scrollTo(0, 300 * Math.floor(index / 3)), i);
      await sleep(500);
      
      const currentButtons = await page.$$('button[aria-label="Resumé"]');
      await currentButtons[i].click();
      
      await sleep(2000);
      
      // Wait for drawer UI to open
      await page.waitForSelector('[data-testid="profile-header-details"]', { visible: true, timeout: 10000 }).catch(() => {});
      await sleep(2000);
      
      // Get candidate name from h2 tag
      const candidateNameFromPage = await page.evaluate(() => {
        const nameElement = document.querySelector('h2._5r6dm10._1m0933750._17ld4pa0._17ld4pah._17ld4pak._8h4erf4._17ld4pa1t');
        if (nameElement && nameElement.textContent) {
          return nameElement.textContent.trim();
        }
        
        const profileHeader = document.querySelector('[data-testid="profile-header-details"]');
        if (profileHeader) {
          const h2Element = profileHeader.querySelector('h2');
          if (h2Element && h2Element.textContent) {
            return h2Element.textContent.trim();
          }
        }
        
        return null;
      });
      
      console.log(`  → Extracted candidate name: ${candidateNameFromPage || 'NOT FOUND'}`);
      
      // Generate filename
      const timestamp = Date.now();
      const tempCandidateName = candidateNameFromPage || `Candidate_${timestamp}`;
      const sanitizedName = tempCandidateName.replace(/[<>:"/\\|?*]/g, '_');
      let finalFileName = `${sanitizedName}_Resume.pdf`; 
      
      // Download resume
      let fileBinaryData = null;
      let downloadSuccess = false;
      
      console.log(`  → Searching for download button...`);
      
      try {
        await page.waitForSelector('#download-document-viewer', { visible: true, timeout: 10000 });
        console.log(`  → Download button found!`);
        
        let targetResponse = null;
        let detectedExtension = '.pdf';
        
        // ===== UPDATED RESPONSE HANDLER WITH RTF SUPPORT =====
        const responseHandler = (response) => {
          const url = response.url().toLowerCase();
          const headers = response.headers();
          const contentType = (headers['content-type'] || '').toLowerCase();

          // 1. Detect RTF specifically (CRITICAL FIX)
          const isRTF = contentType.includes('rtf') || 
                        contentType.includes('rich') || 
                        url.endsWith('.rtf');

          // 2. Detect TXT (NEW ADDITION)
          const isTxt = contentType.includes('text/plain') || url.endsWith('.txt');

          const isPDF = contentType.includes('application/pdf') || url.includes('.pdf');
          
          const isWord = contentType.includes('word') || 
                         contentType.includes('officedocument') || 
                         url.includes('.docx') || 
                         url.includes('.doc');
                         
          const isImage = contentType.includes('image/') || url.includes('.jpg') || url.includes('.png');
          const isStream = contentType.includes('application/octet-stream'); 

          // Add isTxt to the check
          if (isPDF || isWord || isImage || isStream || isRTF || isTxt) {
            if (!url.includes('google') && !url.includes('analytics') && !url.includes('facebook')) {
               console.log(`  → File response detected! Type: ${contentType}`);
               
               if (isRTF) {
                   detectedExtension = '.rtf';
                   console.log('  → RTF Format Detected!');
               }
               else if (isTxt) { // NEW LOGIC
                   detectedExtension = '.txt';
                   console.log('  → TXT Format Detected!');
               }
               else if (isWord) {
                   if (url.includes('.docx')) detectedExtension = '.docx';
                   else detectedExtension = '.doc';
               }
               else if (contentType.includes('jpeg') || url.includes('.jpg')) detectedExtension = '.jpg';
               else if (contentType.includes('png') || url.includes('.png')) detectedExtension = '.png';
               else {
                   detectedExtension = '.pdf'; 
               }
               
               targetResponse = response;
            }
          }
        };
        
        page.on('response', responseHandler);
        await page.click('#download-document-viewer');
        console.log(`  → Download button clicked`);
        
        for (let j = 0; j < 60; j++) {
          if (targetResponse) break;
          await sleep(500);
        }
        
        page.off('response', responseHandler);
        
        if (targetResponse) {
          finalFileName = `${sanitizedName}_Resume${detectedExtension}`;
          const fileBuffer = await targetResponse.buffer();
          fileBinaryData = fileBuffer.toString('base64');
          downloadSuccess = true;
          console.log(`  → ✓ FILE SUCCESSFULLY READ (${fileBuffer.length} bytes)`);
        } else {
          console.log(`  → ✗ No file response received (Timeout)`);
        }
        
      } catch (downloadError) {
        console.log(`  → ✗ DOWNLOAD FAILED: ${downloadError.message}`);
      }
      
      const resumePageUrl = page.url();
      
      // ===== CRITICAL: SCROLL PDF TO LOAD ALL PAGES FIRST =====
      console.log('  → Loading ALL PDF pages aggressively...');

      // STEP 1: Multiple scroll passes with longer waits
      for (let pass = 0; pass < 3; pass++) {
        console.log(`  → Scroll pass ${pass + 1}/3`);
        
        // Scroll down slowly
        for (let scrollAttempt = 0; scrollAttempt < 10; scrollAttempt++) {
          await page.evaluate((attempt) => {
            const pdfContainer = document.querySelector('.react-pdf__Document');
            if (pdfContainer) {
              pdfContainer.scrollTop = (pdfContainer.scrollHeight / 10) * (attempt + 1);
            }
            const dialog = document.querySelector('[role="dialog"]');
            if (dialog) {
              dialog.scrollTop = (dialog.scrollHeight / 10) * (attempt + 1);
            }
          }, scrollAttempt);
          await sleep(300); // Wait for text layers to render
        }
        
        // Scroll back to top
        await page.evaluate(() => {
          const pdfContainer = document.querySelector('.react-pdf__Document');
          if (pdfContainer) pdfContainer.scrollTop = 0;
          const dialog = document.querySelector('[role="dialog"]');
          if (dialog) dialog.scrollTop = 0;
        });
        await sleep(1000);
      }
      
      // STEP 2: Final wait for all text layers to stabilize
      await sleep(2000);
      console.log('  → PDF fully loaded, extracting text...');
      
      // ===== EXTRACT CONTACT AND TEXT FROM PDF ONLY =====
      console.log('  → Extracting Data (Priority: Web UI > PDF)...');
      
      const extractionResult = await page.evaluate(() => {
        // --- HELPER 1: IS REFERENCE? (Fixed for Sai/Hawa) ---
        const isReference = (fullText, matchIndex) => {
          const start = Math.max(0, matchIndex - 1000); 
          const end = Math.min(fullText.length, matchIndex + 300);
          const segmentLower = fullText.substring(start, end).toLowerCase();
          
          // 1. Check Standard Keywords
          const keywords = ['reference', 'referee', 'manager', 'supervisor', 'report to', 'emergency', 'contact person', 'previous employer'];
          for (const word of keywords) { if (segmentLower.includes(word)) return true; }

          // 2. Check Spaced Keywords (For Sai Prakassh)
          const tight = segmentLower.replace(/\s+/g, '');
          if ((tight.includes('reference') || tight.includes('referee')) && 
              (segmentLower.includes('r e f e r e n c e') || segmentLower.includes('r e f e r e e'))) {
              return true;
          }
          return false;
        };

        // --- HELPER 2: PDF TEXT EXTRACTOR ---
        let pdfText = '';
        let firstPageText = '';
        
        // METHOD 1: Try text layer selectors (current approach - unchanged)
        const textLayerSelectors = [
          '.react-pdf__Page__textContent.textLayer',
          '.react-pdf__Page__textContent', 
          '.textLayer',
          '[class*="textLayer"]',
          '[class*="page"] [class*="text"]'
        ];
        
        for (const selector of textLayerSelectors) {
          const layers = document.querySelectorAll(selector);
          if (layers && layers.length > 0) {
            console.log(`✓ Found ${layers.length} text layers with selector: ${selector}`);
            const pageTexts = Array.from(layers).map((layer, idx) => {
               const t = (layer.innerText || layer.textContent || '').trim();
               if (idx === 0) firstPageText = t;
               return t;
            }).filter(t => t.length > 10); // Filter out empty/tiny layers
            
            if (pageTexts.length > 0 && pageTexts.join('').length > 200) {
              pdfText = pageTexts.join('\n\n--- PAGE BREAK ---\n\n');
              console.log(`✓ Method 1: Extracted ${pdfText.length} chars from ${pageTexts.length} pages`);
              break;
            }
          }
        }
        
        // METHOD 2: Fallback - PDF Document container
        if (!pdfText || pdfText.length < 200) {
          console.log('⚠ Method 1 insufficient, trying PDF Document container...');
          const pdfDoc = document.querySelector('.react-pdf__Document');
          if (pdfDoc) {
            const allText = (pdfDoc.innerText || pdfDoc.textContent || '').trim();
            if (allText.length > 200) {
              pdfText = allText;
              firstPageText = allText.substring(0, 2000);
              console.log(`✓ Method 2: Extracted ${pdfText.length} chars from PDF Document`);
            }
          }
        }
        
        // METHOD 3: Fallback - Entire drawer/dialog
        if (!pdfText || pdfText.length < 200) {
          console.log('⚠ Method 2 insufficient, trying entire dialog...');
          const dialog = document.querySelector('[role="dialog"]');
          if (dialog) {
            const allText = (dialog.innerText || dialog.textContent || '').trim();
            if (allText.length > 200) {
              pdfText = allText;
              firstPageText = allText.substring(0, 2000);
              console.log(`✓ Method 3: Extracted ${pdfText.length} chars from dialog`);
            }
          }
        }
        
        // METHOD 4: Last resort - Individual span collection
        if (!pdfText || pdfText.length < 200) {
          console.log('⚠ Method 3 insufficient, trying span collection...');
          const allSpans = document.querySelectorAll('.react-pdf__Page span, [class*="page"] span, [role="dialog"] span');
          if (allSpans && allSpans.length > 0) {
            const spanTexts = Array.from(allSpans)
              .map(span => (span.innerText || span.textContent || '').trim())
              .filter(t => t.length > 0);
            
            if (spanTexts.length > 0) {
              pdfText = spanTexts.join(' ');
              firstPageText = pdfText.substring(0, 2000);
              console.log(`✓ Method 4: Extracted ${pdfText.length} chars from ${allSpans.length} spans`);
            }
          }
        }
        
        // VALIDATION
        if (!pdfText || pdfText.length < 100) {
          console.log('✗ WARNING: PDF text extraction failed or too short! Only got ' + pdfText.length + ' chars');
        } else {
          console.log(`✓ FINAL: Successfully extracted ${pdfText.length} characters total`);
        }

        // --- STEP 1: SCRAPE WEB UI (Cleanest Data - Fixes Adibah & Derric) ---
        let finalEmail = '';
        let finalPhone = '';
        
        const mailLink = document.querySelector('a[href^="mailto:"]');
        if (mailLink) {
           finalEmail = mailLink.getAttribute('href').replace('mailto:', '').trim();
        }

        const telLink = document.querySelector('a[href^="tel:"]');
        if (telLink) {
           finalPhone = telLink.getAttribute('href').replace('tel:', '').trim();
        }

        // --- STEP 2: PDF FALLBACK (If Web failed) ---
        // Fixes candidates who didn't fill JobStreet profile but have it in PDF
        
        if (!finalEmail) {
           // Regex for email
           const emailMatch = pdfText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
           if (emailMatch) {
               const foundEmail = emailMatch[0];
               // Filter out dummy emails
               if (!foundEmail.includes('noreply') && !foundEmail.includes('jobstreet')) finalEmail = foundEmail;
           }
        }

        if (!finalPhone) {
           // Regex for Phone (With Hawa/Sai Reference Logic)
           const phonePatterns = [
              /(?:^|[^\d])(01[0-9][-\s]?\d{3,4}[-\s]?\d{4})(?:[^\d]|$)/g, // 01...
              /(\(?\+?60\)?[-\s]?1[0-9][-\s]?\d{3,4}[-\s]?\d{4})/g,        // +60...
              /(0[3-9][-\s]?\d{7,8})/g                                      // Landline
           ];

           // A. Check Top of First Page (High Priority)
           const topText = firstPageText.substring(0, 1500);
           for (const pattern of phonePatterns) {
              const matches = [...topText.matchAll(pattern)];
              for (const m of matches) {
                 if (!isReference(topText, m.index)) {
                    finalPhone = (m[1] || m[0]).trim();
                    break;
                 }
              }
              if (finalPhone) break;
           }

           // B. Check Full Text (Low Priority)
           if (!finalPhone) {
              for (const pattern of phonePatterns) {
                 const matches = [...pdfText.matchAll(pattern)];
                 for (const m of matches) {
                    if (!isReference(pdfText, m.index)) {
                       finalPhone = (m[1] || m[0]).trim();
                       break;
                    }
                 }
                 if (finalPhone) break;
              }
           }
        }

        return {
          phone: finalPhone || '',
          email: finalEmail || '',
          pdfText: pdfText || ''
        };
      });

      
      
      // ===== FORMAT PHONE FOR GOOGLE SHEETS (avoid #ERROR!) =====
      let formattedPhone = extractionResult.phone || '';
      if (formattedPhone) {
        // Ensure leading zero
        let cleanPhone = formattedPhone.trim();
        const digitsOnly = cleanPhone.replace(/[^\d]/g, '');
        
        // If it's just digits without country code and missing leading 0
        if (/^\d{9,10}$/.test(digitsOnly) && !digitsOnly.startsWith('0')) {
          // Add leading zero
          cleanPhone = '0' + cleanPhone;
        }
        
        // CRITICAL FIX: Add apostrophe prefix for Google Sheets
        // This tells Google Sheets to treat it as TEXT, not formula
        formattedPhone = "'" + cleanPhone;
        console.log(`  → Formatted phone for GSheets: ${formattedPhone}`);
      }
      
      console.log(`  → EXTRACTED: Phone="${formattedPhone || 'NOT FOUND'}", Email="${extractionResult.email || 'NOT FOUND'}"`);
      console.log(`  → PDF Text: ${extractionResult.pdfText.length} characters`);
      
      // ===== BUILD FINAL RESUME TEXT =====
      let resumeText = '';
      
      resumeText = `===== CONTACT INFORMATION =====\n`;
      resumeText += `Phone: ${formattedPhone || 'Not found'}\n`;
      resumeText += `Email: ${extractionResult.email || 'Not found'}\n`;
      resumeText += `================================\n\n`;
      
      resumeText += extractionResult.pdfText;
      resumeText = resumeText.replace(/\s+/g, ' ').trim();
      
      console.log(`  → Final resume text: ${resumeText.length} characters`);
      
      // Extract application date
      const applicationDateData = await page.evaluate(() => {
        const appliedSpan = document.querySelector('span._5r6dm10[aria-describedby]');
        if (appliedSpan) {
          return appliedSpan.getAttribute('aria-describedby');
        }
        return null;
      });
      
      console.log(`  → Application date: ${applicationDateData || 'NOT FOUND'}`);
      
      let year, month, monthFolder;
      if (applicationDateData) {
        const appDate = new Date(applicationDateData);
        year = appDate.getFullYear().toString();
        month = (appDate.getMonth() + 1).toString();
        monthFolder = `${month} - ${year}`;
      } else {
        const now = new Date();
        year = now.getFullYear().toString();
        month = (now.getMonth() + 1).toString();
        monthFolder = `${month} - ${year}`;
      }
      
      const candidateName = candidateNameFromPage || `Candidate_${timestamp}`;
      
      const itemData = {
        candidateName: candidateName,
        jobRole: CONFIG.jobRole || 'Unknown Role',
        jobId: CONFIG.jobId || 'Unknown',
        employmentType: CONFIG.employmentType || 'Unknown',
        jobDescription: CONFIG.jobDescription || '',
        jobResponsibility: CONFIG.jobResponsibility || '',
        companyCulture: CONFIG.companyCulture || '',
        additionalRequirements: CONFIG.additionalRequirements || '',
        groupARequirements: CONFIG.groupARequirements || '',
        groupBRequirements: CONFIG.groupBRequirements || '',
        groupCRequirements: CONFIG.groupCRequirements || '',
        groupDRequirements: CONFIG.groupDRequirements || '',
        year: year,
        month: month,
        monthFolder: monthFolder,
        resumePageUrl: resumePageUrl,
        resumeText: resumeText,
        fileName: finalFileName,
        cookies: savedCookies,
        status: downloadSuccess ? 'processed' : 'no_file',
        newCandidatesCount: newCandidatesInfo.count,
        newCandidatesText: newCandidatesInfo.fullText
      };
      
      // ===== UPDATED BINARY OUTPUT =====
      const itemBinary = {};
      if (fileBinaryData) {
        let mimeType = 'application/octet-stream';
        
        if (finalFileName.includes('.pdf')) mimeType = 'application/pdf';
        else if (finalFileName.includes('.rtf')) mimeType = 'application/rtf';
        else if (finalFileName.includes('.txt')) mimeType = 'text/plain';
        else if (finalFileName.includes('.doc')) mimeType = 'application/msword';
        else if (finalFileName.includes('.docx')) mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

        itemBinary.data = {
          data: fileBinaryData,
          mimeType: mimeType,
          fileName: finalFileName
        };
      }
      
      results.push({
        json: itemData,
        binary: itemBinary
      });
      
      console.log(`✓ Processed: ${candidateName}`);
      
      await page.goBack();
      await sleep(2000);
    }
    
    // Check for next page
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await sleep(1000);
    
    const nextClicked = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll('button, a'));
      for (let el of els) {
        if (el.textContent?.trim() === 'Next' && !el.hasAttribute('disabled')) {
          el.click();
          return true;
        }
      }
      return false;
    });
    
    if (nextClicked) {
      console.log('✓ Navigated to next page');
      await sleep(3000);
      currentPage++;
      await page.evaluate(() => window.scrollTo(0, 0));
      await sleep(1000);
    } else {
      hasMorePages = false;
      console.log('✓ No more pages');
    }
  }
  
  console.log(`\n=== COMPLETED: ${results.length} candidates processed ===`);
  
  // ===== SAVE RESULTS TO FILE =====
  console.log('\n=== SAVING RESULTS ===');
  fs.writeFileSync('./results.json', JSON.stringify(results, null, 2));
  console.log('✓ Results saved to results.json\n');
  
  // ===== FINAL SUMMARY =====
  console.log('==============================================');
  console.log('✅✅✅ SCRAPING COMPLETE! ✅✅✅');
  console.log('==============================================');
  console.log('📊 SUMMARY:');
  console.log(`   Total candidates: ${results.length}`);
  console.log(`   New candidates: ${newCandidatesInfo.count}`);
  console.log(`   Files downloaded: ${results.filter(r => r.json.status === 'processed').length}`);
  console.log(`   Cookies saved: ${savedCookies.length}`);
  console.log('==============================================\n');
  
  await sleep(10000);
  await browser.close();
  
  return results;
}

// ===== RUN IT =====
completeJobStreetScraper().catch(err => {
  console.error('\n💥 ERROR:', err);
  process.exit(1);
});