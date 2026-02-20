import { getChecklistProgress } from './testChecklist'

const SUBMISSION_KEY = 'prp_final_submission'
const STEPS_KEY = 'prp_steps_completion'

export const STEPS = [
  { id: 'step1', label: 'Project Setup & Design System' },
  { id: 'step2', label: 'Landing Page & Dashboard' },
  { id: 'step3', label: 'JD Analysis Engine' },
  { id: 'step4', label: 'Interactive Features' },
  { id: 'step5', label: 'Company Intel & Round Mapping' },
  { id: 'step6', label: 'Practice Tracker' },
  { id: 'step7', label: 'Validation & Error Handling' },
  { id: 'step8', label: 'Test Checklist & Ship Lock' }
]

export function validateURL(url) {
  if (!url || url.trim() === '') return false
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function getSubmission() {
  try {
    const data = localStorage.getItem(SUBMISSION_KEY)
    return data ? JSON.parse(data) : {
      githubLink: '',
      deployedLink: ''
    }
  } catch (error) {
    console.error('Error reading submission:', error)
    return {
      githubLink: '',
      deployedLink: ''
    }
  }
}

export function saveSubmission(submission) {
  try {
    localStorage.setItem(SUBMISSION_KEY, JSON.stringify(submission))
    return true
  } catch (error) {
    console.error('Error saving submission:', error)
    return false
  }
}

export function getStepsCompletion() {
  try {
    const data = localStorage.getItem(STEPS_KEY)
    return data ? JSON.parse(data) : {}
  } catch (error) {
    console.error('Error reading steps:', error)
    return {}
  }
}

export function saveStepsCompletion(steps) {
  try {
    localStorage.setItem(STEPS_KEY, JSON.stringify(steps))
    return true
  } catch (error) {
    console.error('Error saving steps:', error)
    return false
  }
}

export function toggleStep(stepId) {
  const steps = getStepsCompletion()
  steps[stepId] = !steps[stepId]
  saveStepsCompletion(steps)
  return steps
}

export function getShippedStatus() {
  // Check all 3 conditions
  const steps = getStepsCompletion()
  const allStepsComplete = STEPS.every(step => steps[step.id])
  
  const { isComplete: checklistComplete } = getChecklistProgress()
  
  const submission = getSubmission()
  const allLinksProvided = 
    validateURL(submission.githubLink) &&
    validateURL(submission.deployedLink)
  
  return {
    isShipped: allStepsComplete && checklistComplete && allLinksProvided,
    stepsComplete: allStepsComplete,
    checklistComplete,
    linksProvided: allLinksProvided,
    stepsCount: STEPS.filter(step => steps[step.id]).length,
    totalSteps: STEPS.length
  }
}

export function generateSubmissionText(submission) {
  return `------------------------------------------
Placement Readiness Platform — Final Submission

GitHub Repository: ${submission.githubLink || '[Not provided]'}
Live Deployment: ${submission.deployedLink || '[Not provided]'}

Core Capabilities:
- JD skill extraction (deterministic)
- Round mapping engine
- 7-day prep plan
- Interactive readiness scoring
- History persistence

------------------------------------------`
}
