const CHECKLIST_KEY = 'prp_test_checklist'

export const TEST_ITEMS = [
  {
    id: 'jd-required',
    label: 'JD required validation works',
    hint: 'Go to /app/analyze, leave JD empty, click Analyze. Should show HTML5 validation error.'
  },
  {
    id: 'short-jd-warning',
    label: 'Short JD warning shows for <200 chars',
    hint: 'Enter JD with <200 characters. Should show amber warning but allow submission.'
  },
  {
    id: 'skills-extraction',
    label: 'Skills extraction groups correctly',
    hint: 'Analyze JD with React, Python, AWS. Check results page shows skills grouped by category.'
  },
  {
    id: 'round-mapping',
    label: 'Round mapping changes based on company + skills',
    hint: 'Test with "Google" (4 rounds) vs "MyStartup" (3 rounds). Verify different round structures.'
  },
  {
    id: 'score-calculation',
    label: 'Score calculation is deterministic',
    hint: 'Analyze same JD twice. Should get same base score both times.'
  },
  {
    id: 'skill-toggles',
    label: 'Skill toggles update score live',
    hint: 'On results page, click skill tags. Score should update immediately (+2 for know/completed).'
  },
  {
    id: 'persist-refresh',
    label: 'Changes persist after refresh',
    hint: 'Mark skills, refresh page (F5), reopen from history. Skill selections should be retained.'
  },
  {
    id: 'history-saves',
    label: 'History saves and loads correctly',
    hint: 'Analyze 2 jobs, go to history, verify both appear. Click to view, should load correctly.'
  },
  {
    id: 'export-buttons',
    label: 'Export buttons copy the correct content',
    hint: 'Click "Copy 7-Day Plan", paste in notepad. Should show formatted plan text.'
  },
  {
    id: 'no-console-errors',
    label: 'No console errors on core pages',
    hint: 'Open DevTools console (F12). Navigate through /, /app, /app/analyze, /app/results. Should see no red errors.'
  }
]

export function getChecklist() {
  try {
    const data = localStorage.getItem(CHECKLIST_KEY)
    if (!data) return {}
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading checklist:', error)
    return {}
  }
}

export function saveChecklist(checklist) {
  try {
    localStorage.setItem(CHECKLIST_KEY, JSON.stringify(checklist))
    return true
  } catch (error) {
    console.error('Error saving checklist:', error)
    return false
  }
}

export function toggleChecklistItem(itemId) {
  const checklist = getChecklist()
  checklist[itemId] = !checklist[itemId]
  saveChecklist(checklist)
  return checklist
}

export function resetChecklist() {
  localStorage.removeItem(CHECKLIST_KEY)
  return {}
}

export function getChecklistProgress() {
  const checklist = getChecklist()
  const total = TEST_ITEMS.length
  const passed = TEST_ITEMS.filter(item => checklist[item.id]).length
  return { passed, total, isComplete: passed === total }
}

export function isShipUnlocked() {
  const { isComplete } = getChecklistProgress()
  return isComplete
}
