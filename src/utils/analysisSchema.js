import { sanitizeString, ensureArray, ensureObject } from './validation'

export function createAnalysisEntry(data) {
  const now = new Date().toISOString()
  
  return {
    id: data.id || Date.now().toString(),
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now,
    
    // Basic info
    company: sanitizeString(data.company),
    role: sanitizeString(data.role),
    jdText: sanitizeString(data.jdText),
    
    // Extracted skills - standardized structure
    extractedSkills: normalizeSkills(data.extractedSkills),
    
    // Company intel
    companyIntel: data.companyIntel || null,
    
    // Round mapping
    roundMapping: ensureArray(data.roundMapping),
    
    // Checklist
    checklist: ensureObject(data.checklist),
    
    // 7-day plan
    plan: ensureObject(data.plan),
    
    // Questions
    questions: ensureArray(data.questions),
    
    // Scores
    baseScore: typeof data.readinessScore === 'number' ? data.readinessScore : 0,
    readinessScore: typeof data.readinessScore === 'number' ? data.readinessScore : 0,
    
    // Skill confidence
    skillConfidenceMap: ensureObject(data.skillConfidenceMap)
  }
}

function normalizeSkills(skills) {
  if (!skills || typeof skills !== 'object') {
    return {
      'Core CS': [],
      'Languages': [],
      'Web': [],
      'Data': [],
      'Cloud/DevOps': [],
      'Testing': [],
      'General': []
    }
  }
  
  // Ensure all expected categories exist
  const normalized = {
    'Core CS': ensureArray(skills['Core CS']),
    'Languages': ensureArray(skills['Languages']),
    'Web': ensureArray(skills['Web']),
    'Data': ensureArray(skills['Data']),
    'Cloud/DevOps': ensureArray(skills['Cloud/DevOps']),
    'Testing': ensureArray(skills['Testing']),
    'General': ensureArray(skills['General'])
  }
  
  // If no skills detected at all, add default general skills
  const hasAnySkills = Object.values(normalized).some(arr => arr.length > 0)
  if (!hasAnySkills) {
    normalized['General'] = [
      'Communication',
      'Problem solving',
      'Basic coding',
      'Projects'
    ]
  }
  
  // Remove empty categories
  Object.keys(normalized).forEach(key => {
    if (normalized[key].length === 0) {
      delete normalized[key]
    }
  })
  
  return normalized
}

export function validateAnalysisEntry(entry) {
  try {
    if (!entry || typeof entry !== 'object') return false
    if (!entry.id || !entry.jdText) return false
    if (typeof entry.readinessScore !== 'number') return false
    return true
  } catch (error) {
    console.error('Entry validation error:', error)
    return false
  }
}
