export function validateJD(jdText) {
  const errors = []
  const warnings = []

  if (!jdText || jdText.trim().length === 0) {
    errors.push('Job description is required')
  } else if (jdText.trim().length < 200) {
    warnings.push('This JD is too short to analyze deeply. Paste full JD for better output.')
  }

  return { errors, warnings, isValid: errors.length === 0 }
}

export function sanitizeString(str) {
  return str ? str.trim() : ''
}

export function ensureArray(value) {
  if (Array.isArray(value)) return value
  return []
}

export function ensureObject(value) {
  if (value && typeof value === 'object' && !Array.isArray(value)) return value
  return {}
}
