import { useState, useEffect } from 'react'
import { CheckCircle2, Circle, Link as LinkIcon, Copy, Check, Award, AlertCircle } from 'lucide-react'
import Card, { CardHeader, CardTitle, CardContent } from '../components/Card'
import { 
  STEPS, 
  getSubmission, 
  saveSubmission, 
  getStepsCompletion, 
  toggleStep, 
  validateURL,
  getShippedStatus,
  generateSubmissionText
} from '../utils/proofSystem'

export default function Proof() {
  const [submission, setSubmission] = useState({ lovableLink: '', githubLink: '', deployedLink: '' })
  const [steps, setSteps] = useState({})
  const [status, setStatus] = useState({})
  const [copied, setCopied] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setSubmission(getSubmission())
    setSteps(getStepsCompletion())
    setStatus(getShippedStatus())
  }

  const handleStepToggle = (stepId) => {
    const updated = toggleStep(stepId)
    setSteps(updated)
    setStatus(getShippedStatus())
  }

  const handleLinkChange = (field, value) => {
    const updated = { ...submission, [field]: value }
    setSubmission(updated)
    
    // Clear error when user types
    if (errors[field]) {
      setErrors({ ...errors, [field]: false })
    }
  }

  const handleLinkBlur = (field) => {
    const value = submission[field]
    if (value && !validateURL(value)) {
      setErrors({ ...errors, [field]: true })
    } else {
      setErrors({ ...errors, [field]: false })
    }
    saveSubmission(submission)
    setStatus(getShippedStatus())
  }

  const handleCopySubmission = () => {
    const text = generateSubmissionText(submission)
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Proof of Work</h2>
        <p className="text-gray-600 mt-2">
          Document your completed work and prepare for submission
        </p>
      </div>

      {/* Shipped Status */}
      {status.isShipped && (
        <Card className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-300">
          <CardContent className="p-8 text-center">
            <Award className="w-20 h-20 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Status: Shipped ✓
            </h3>
            <div className="max-w-2xl mx-auto text-gray-800 space-y-3">
              <p className="text-lg font-medium">You built a real product.</p>
              <p>Not a tutorial. Not a clone.</p>
              <p>A structured tool that solves a real problem.</p>
              <p className="text-xl font-semibold mt-4">This is your proof of work.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Overview */}
      {!status.isShipped && (
        <Card className="mb-6 bg-gradient-to-r from-orange-50 to-amber-50 border-orange-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Status: In Progress
                </h3>
                <div className="space-y-1 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    {status.stepsComplete ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-orange-600" />
                    )}
                    <span>Steps: {status.stepsCount} / {status.totalSteps}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {status.checklistComplete ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-orange-600" />
                    )}
                    <span>Test Checklist: {status.checklistComplete ? 'Complete' : 'Incomplete'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {status.linksProvided ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-orange-600" />
                    )}
                    <span>Proof Links: {status.linksProvided ? 'Provided' : 'Missing'}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Complete all to ship</p>
                <div className="text-4xl font-bold text-orange-600">
                  {Math.round(((status.stepsCount / status.totalSteps) + 
                    (status.checklistComplete ? 1 : 0) + 
                    (status.linksProvided ? 1 : 0)) / 3 * 100)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step Completion Overview */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Step Completion Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            {STEPS.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => handleStepToggle(step.id)}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left ${
                  steps[step.id]
                    ? 'bg-green-50 border-green-300'
                    : 'bg-gray-50 border-gray-200 hover:border-primary'
                }`}
              >
                {steps[step.id] ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-400 flex-shrink-0" />
                )}
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Step {idx + 1}
                  </p>
                  <p className={`text-sm ${steps[step.id] ? 'text-gray-600' : 'text-gray-700'}`}>
                    {step.label}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Artifact Inputs */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-primary" />
            Proof Artifacts (Required)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Lovable Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lovable Project Link <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={submission.lovableLink}
                onChange={(e) => handleLinkChange('lovableLink', e.target.value)}
                onBlur={() => handleLinkBlur('lovableLink')}
                placeholder="https://lovable.dev/projects/..."
                className={`w-full px-4 py-2 border-2 rounded-lg outline-none transition-all ${
                  errors.lovableLink
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 focus:border-primary'
                }`}
              />
              {errors.lovableLink && (
                <p className="text-sm text-red-600 mt-1">Please enter a valid URL</p>
              )}
            </div>

            {/* GitHub Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GitHub Repository Link <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={submission.githubLink}
                onChange={(e) => handleLinkChange('githubLink', e.target.value)}
                onBlur={() => handleLinkBlur('githubLink')}
                placeholder="https://github.com/username/repo"
                className={`w-full px-4 py-2 border-2 rounded-lg outline-none transition-all ${
                  errors.githubLink
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 focus:border-primary'
                }`}
              />
              {errors.githubLink && (
                <p className="text-sm text-red-600 mt-1">Please enter a valid URL</p>
              )}
            </div>

            {/* Deployed Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deployed URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={submission.deployedLink}
                onChange={(e) => handleLinkChange('deployedLink', e.target.value)}
                onBlur={() => handleLinkBlur('deployedLink')}
                placeholder="https://your-app.vercel.app"
                className={`w-full px-4 py-2 border-2 rounded-lg outline-none transition-all ${
                  errors.deployedLink
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 focus:border-primary'
                }`}
              />
              {errors.deployedLink && (
                <p className="text-sm text-red-600 mt-1">Please enter a valid URL</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Final Submission Export */}
      <Card>
        <CardHeader>
          <CardTitle>Final Submission</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Copy this formatted submission text to share your completed project.
            </p>
            
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-xs whitespace-pre-wrap">
              {generateSubmissionText(submission)}
            </div>

            <button
              onClick={handleCopySubmission}
              className="w-full bg-primary hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copy Final Submission
                </>
              )}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
