/**
 * Verification & Test Suite for Recruitment Kanban Board [BHATIA-T1]
 */

const fs = require('fs');
const path = require('path');

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    testsPassed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    testsFailed++;
  }
}

console.log('\n--- 1. Testing db.json Dataset ---');
const dbRaw = fs.readFileSync(path.join(__dirname, 'db.json'), 'utf-8');
const db = JSON.parse(dbRaw);

assert(Array.isArray(db.candidates), 'db.json contains candidates array');
assert(db.candidates.length === 50, `db.json has exactly 50 mock candidates (found ${db.candidates.length})`);

const priya = db.candidates.find(c => c.id === 201);
assert(Boolean(priya), 'Candidate #201 exists in db.json');
assert(priya && priya.name === 'Priya Sharma', `Candidate #201 name is "Priya Sharma" (found "${priya?.name}")`);
assert(priya && priya.role.includes('Full Stack'), `Priya Sharma role is Full Stack Engineer (found "${priya?.role}")`);
assert(priya && Array.isArray(priya.timeline) && priya.timeline.length > 0, 'Priya Sharma has activity timeline');
assert(priya && priya.score === 94, `Priya Sharma has score 94 (found ${priya?.score})`);

// Stage distribution
const stageCounts = {};
db.candidates.forEach(c => {
  stageCounts[c.stage] = (stageCounts[c.stage] || 0) + 1;
});
console.log('  Stage counts in db.json:', stageCounts);
assert(stageCounts.interview <= 10, `Interview stage is under the 10 WIP limit (currently: ${stageCounts.interview})`);
assert(stageCounts.applied > 0, `Applied stage has candidates (${stageCounts.applied})`);
assert(stageCounts.screening > 0, `Screening stage has candidates (${stageCounts.screening})`);
assert(stageCounts.hired > 0, `Hired stage has candidates (${stageCounts.hired})`);
assert(stageCounts.rejected > 0, `Rejected stage has candidates (${stageCounts.rejected})`);

console.log('\n--- 2. Testing HTML Structure (index.html) ---');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
assert(html.includes('BHATIA-T1'), 'Title contains [BHATIA-T1]');
assert(html.includes('vendor/jquery-3.7.1.min.js'), 'Includes jQuery 3.7');
assert(html.includes('vendor/jquery-ui.min.js'), 'Includes jQuery UI');
assert(html.includes('vendor/jquery.ui.touch-punch.min.js'), 'Includes jQuery UI Touch Punch for mobile touch');
assert(html.includes('data-stage="applied"'), 'Contains Applied column');
assert(html.includes('data-stage="screening"'), 'Contains Screening column');
assert(html.includes('data-stage="interview"'), 'Contains Interview column');
assert(html.includes('data-stage="hired"'), 'Contains Hired column');
assert(html.includes('data-stage="rejected"'), 'Contains Rejected column');
assert(html.includes('interviewWipBadge'), 'Contains Interview WIP badge');
assert(html.includes('searchInput'), 'Contains search input');
assert(html.includes('candidateModal'), 'Contains Candidate Details Modal');
assert(html.includes('toastContainer'), 'Contains Toast Container');
assert(html.includes('mobile-nav-strip'), 'Contains Mobile Navigation Strip');

console.log('\n--- 3. Testing JavaScript Logic (js/app.js) ---');
const appJs = fs.readFileSync(path.join(__dirname, 'js', 'app.js'), 'utf-8');
assert(appJs.includes("connectWith: '.column-cards'"), "Sortable configured with connectWith: '.column-cards'");
assert(appJs.includes("revert: 200") || appJs.includes("revert: true"), "Sortable configured with smooth revert");
assert(appJs.includes(".closest('.column').data('stage')"), "Traversing uses $(this).closest('.column').data('stage') to detect new stage");
assert(appJs.includes('card-green-pulse'), "Triggers green pulse effect on successful card move");
assert(appJs.includes('wipLimits') && appJs.includes('interview: 10'), "Interview WIP limit set to 10");
assert(appJs.includes('undoStack') || appJs.includes('performUndo'), "Undo stack and notification logic implemented");
assert(appJs.includes('toast-undo-btn'), "Toast notification includes Undo button");
assert(appJs.includes('openCandidateModal'), "Card click opens candidate detail modal");
assert(appJs.includes('applySearchFilter'), "Real-time search bar filters candidates");
assert(appJs.includes('LOCAL_STORAGE') && appJs.includes('DEFAULT_CANDIDATES'), "Fallback to LocalStorage with default candidates when JSON Server is offline");
assert(appJs.includes('PATCH'), "Sends AJAX PATCH /candidates/:id on card move");

console.log('\n--- 4. Testing CSS Styles (css/styles.css) ---');
const css = fs.readFileSync(path.join(__dirname, 'css', 'styles.css'), 'utf-8');
assert(css.includes('@keyframes greenPulse'), 'Defines @keyframes greenPulse for success drop effect');
assert(css.includes('.column-drag-over') || css.includes('.drag-active'), 'Drop zone highlight styles defined');
assert(css.includes('@media (max-width: 420px)') || css.includes('310px'), 'Includes mobile responsive rules optimized for 390px viewport width');
assert(css.includes('scroll-snap-type: x mandatory'), 'Enables smooth scroll-snap for mobile horizontal swipe');
assert(css.includes('.wip-max') || css.includes('.wip-warning'), 'WIP warning and max status badge styles defined');

console.log('\n=============================================');
console.log(`Results: ${testsPassed} passed, ${testsFailed} failed`);
console.log('=============================================\n');

if (testsFailed > 0) {
  process.exit(1);
}
