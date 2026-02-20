import { validateAnalysisEntry } from './analysisSchema'

const HISTORY_KEY = 'placement_analysis_history'

export function saveAnalysis(analysisData) {
  const history = getHistory()
  const entry = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...analysisData
  }
  history.unshift(entry)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  return entry
}

export function getHistory() {
  try {
    const data = localStorage.getItem(HISTORY_KEY)
    if (!data) return []
    
    const parsed = JSON.parse(data)
    if (!Array.isArray(parsed)) return []
    
    // Filter out corrupted entries
    const valid = parsed.filter(entry => {
      const isValid = validateAnalysisEntry(entry)
      if (!isValid) {
        console.warn('Skipping corrupted entry:', entry?.id)
      }
      return isValid
    })
    
    return valid
  } catch (error) {
    console.error('Error reading history:', error)
    return []
  }
}

export function getAnalysisById(id) {
  console.log('getAnalysisById called with ID:', id)
  const history = getHistory()
  console.log('Total history items:', history.length)
  const found = history.find(item => item.id === id)
  console.log('Found analysis:', found)
  return found
}

export function deleteAnalysis(id) {
  const history = getHistory()
  const filtered = history.filter(item => item.id !== id)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered))
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY)
}
