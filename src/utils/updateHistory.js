const HISTORY_KEY = 'placement_analysis_history'

export function updateAnalysisInHistory(id, updates) {
  try {
    const data = localStorage.getItem(HISTORY_KEY)
    if (!data) return false
    
    const history = JSON.parse(data)
    const index = history.findIndex(item => item.id === id)
    
    if (index === -1) return false
    
    history[index] = {
      ...history[index],
      ...updates
    }
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
    return true
  } catch (error) {
    console.error('Error updating history:', error)
    return false
  }
}
