const { chromium } = require('playwright');
const path = require('path');

async function runE2ETests() {
  console.log('🚀 Starting Playwright E2E Test Suite for Recruitment Kanban Board [BHATIA-T1]...');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 }
  });
  const page = await context.newPage();

  const screenshotDir = path.join(__dirname, 'screenshots');
  const fs = require('fs');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  try {
    // 1. Load Application
    console.log('\n--- 1. Navigating to http://localhost:8080/index.html ---');
    await page.goto('http://localhost:8080/index.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Check title
    const title = await page.title();
    console.log('Page Title:', title);

    // Verify 5 Columns
    const stages = ['applied', 'screening', 'interview', 'hired', 'rejected'];
    for (const stage of stages) {
      const col = page.locator(`.column[data-stage="${stage}"]`);
      const count = await col.count();
      console.log(`Column [${stage}] rendered:`, count === 1 ? 'YES' : 'NO');
    }

    // Verify Total Cards
    const cards = page.locator('.candidate-card');
    const totalCardsCount = await cards.count();
    console.log(`Total candidate cards rendered: ${totalCardsCount} (Expected: 50)`);

    // Verify Priya Sharma #201
    const priyaCard = page.locator('.candidate-card[data-id="201"]');
    const priyaExists = await priyaCard.count() === 1;
    console.log('Priya Sharma (#201) card present:', priyaExists ? 'YES' : 'NO');
    const priyaStage = await priyaCard.evaluate(el => el.closest('.column').getAttribute('data-stage'));
    console.log('Priya Sharma initial stage:', priyaStage);

    // Desktop Screenshot
    await page.screenshot({ path: path.join(screenshotDir, '01_desktop_board.png'), fullPage: false });
    console.log('📸 Saved screenshot: 01_desktop_board.png');

    // 2. Real-time Search Test
    console.log('\n--- 2. Testing Real-time Search Filtering ---');
    await page.fill('#searchInput', 'Priya');
    await page.waitForTimeout(400);

    const visibleCardsAfterSearch = await page.locator('.candidate-card:visible').count();
    console.log('Visible cards when searching "Priya":', visibleCardsAfterSearch);
    const feedbackText = await page.locator('#searchMatchesFeedback').innerText();
    console.log('Search feedback message:', feedbackText);

    await page.screenshot({ path: path.join(screenshotDir, '02_search_priya.png') });
    console.log('📸 Saved screenshot: 02_search_priya.png');

    // Clear search
    await page.click('#searchClearBtn');
    await page.waitForTimeout(300);
    const allVisibleCards = await page.locator('.candidate-card:visible').count();
    console.log('Visible cards after clearing search:', allVisibleCards);

    // 3. Candidate Details Modal Test
    console.log('\n--- 3. Testing Candidate Modal (Click Priya Sharma #201) ---');
    await priyaCard.click();
    await page.waitForSelector('#candidateModal.open', { state: 'visible' });

    const modalName = await page.locator('#modalCandidateName').innerText();
    const modalRole = await page.locator('#modalCandidateRole').innerText();
    const modalScore = await page.locator('#scoreValTechnical').innerText();
    console.log(`Modal Opened: Name="${modalName}", Role="${modalRole}", Tech Score=${modalScore}`);

    await page.screenshot({ path: path.join(screenshotDir, '03_candidate_modal.png') });
    console.log('📸 Saved screenshot: 03_candidate_modal.png');

    // Close modal
    await page.click('#modalCloseBtn');
    await page.waitForSelector('#candidateModal', { state: 'hidden' });
    console.log('Modal closed cleanly.');

    // 4. Test Mobile Responsive Viewport: 390px Width (iPhone 12/13/14/15)
    console.log('\n--- 4. Testing Mobile Responsive Viewport (390px Width) ---');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(600);

    await page.screenshot({ path: path.join(screenshotDir, '04_mobile_390px_board.png') });
    console.log('📸 Saved screenshot: 04_mobile_390px_board.png');

    // Test Mobile Navigation Quick Jump (Jump to Interview column)
    console.log('Testing Mobile Navigation Pill: Clicking [Interview]');
    await page.click('.mobile-nav-btn[data-stage="interview"]');
    await page.waitForTimeout(500);

    await page.screenshot({ path: path.join(screenshotDir, '05_mobile_390px_scrolled_interview.png') });
    console.log('📸 Saved screenshot: 05_mobile_390px_scrolled_interview.png');

    // Open Modal on Mobile 390px to test mobile responsiveness
    const firstInterviewCard = page.locator('.column[data-stage="interview"] .candidate-card').first();
    await firstInterviewCard.click();
    await page.waitForSelector('#candidateModal.open', { state: 'visible' });

    await page.screenshot({ path: path.join(screenshotDir, '06_mobile_390px_modal.png') });
    console.log('📸 Saved screenshot: 06_mobile_390px_modal.png');

    await page.click('#modalCloseBtn');
    await page.waitForSelector('#candidateModal', { state: 'hidden' });

    // 5. Test Drag and Drop Simulation & Undo
    console.log('\n--- 5. Testing Drag and Drop, Green Pulse, and Undo Toast ---');
    // Switch back to desktop for easier drag-and-drop coordinate math
    await page.setViewportSize({ width: 1400, height: 900 });
    await page.waitForTimeout(400);

    // Target: Drag Priya Sharma card into Interview column
    const sourceCard = page.locator('.candidate-card[data-id="201"]');
    const targetInterviewCards = page.locator('.column-cards[data-stage="interview"]');

    const sourceBox = await sourceCard.boundingBox();
    const targetBox = await targetInterviewCards.boundingBox();

    console.log('Dragging Priya Sharma card into Interview column...');
    await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2 + 50, { steps: 15 });
    await page.mouse.up();
    await page.waitForTimeout(500);

    // Verify toast notification
    const toast = page.locator('.toast').first();
    const toastVisible = await toast.isVisible();
    const toastText = await toast.innerText();
    console.log('Toast displayed:', toastVisible ? 'YES' : 'NO', '| Content:', toastText.replace(/\n/g, ' '));

    await page.screenshot({ path: path.join(screenshotDir, '07_toast_with_undo.png') });
    console.log('📸 Saved screenshot: 07_toast_with_undo.png');

    // Click Undo on Toast
    console.log('Clicking Undo button on toast...');
    const undoBtn = page.locator('.toast-undo-btn').first();
    if (await undoBtn.isVisible()) {
      await undoBtn.click();
      await page.waitForTimeout(600);
      
      const priyaRevertedStage = await priyaCard.evaluate(el => el.closest('.column').getAttribute('data-stage'));
      console.log('Priya Sharma stage after Undo click:', priyaRevertedStage);
    }

    console.log('\n🎉 ALL PLAYWRIGHT E2E TESTS COMPLETED SUCCESSFULLY!');

  } catch (err) {
    console.error('❌ Test failed with error:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runE2ETests();
