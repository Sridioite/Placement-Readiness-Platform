import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Sparkles, RotateCcw } from 'lucide-react'
import Card, { CardHeader, CardTitle, CardContent } from '../components/Card'
import { extractSkills, generateChecklist, generate7DayPlan, generateQuestions, calculateReadinessScore } from '../utils/skillExtractor'
import { getCompanyIntel, generateRoundMapping } from '../utils/companyIntel'
import { saveAnalysis } from '../utils/historyStorage'

export default function Analyze() {
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    jdText: ''
  })
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  useEffect(() => {
    // Check if we're coming from history with pre-filled data
    if (location.state?.editMode) {
      setFormData({
        company: location.state.company || '',
        role: location.state.role || '',
        jdText: location.state.jdText || ''
      })
      setIsEditMode(true)
    }
  }, [location.state])

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsAnalyzing(true)

    // Simulate processing time for better UX
    setTimeout(() => {
      const extractedSkills = extractSkills(formData.jdText)
      const checklist = generateChecklist(extractedSkills)
      const plan = generate7DayPlan(extractedSkills)
      const questions = generateQuestions(extractedSkills)
      const readinessScore = calculateReadinessScore(
        extractedSkills,
        formData.company,
        formData.role,
        formData.jdText
      )
      
      // Generate company intel and round mapping
      const companyIntel = getCompanyIntel(formData.company, extractedSkills)
      const roundMapping = generateRoundMapping(companyIntel, extractedSkills)

      const analysisData = {
        company: formData.company,
        role: formData.role,
        jdText: formData.jdText,
        extractedSkills,
        checklist,
        plan,
        questions,
        readinessScore,
        companyIntel,
        roundMapping
      }

      const savedEntry = saveAnalysis(analysisData)
      setIsAnalyzing(false)
      navigate(`/app/results?id=${savedEntry.id}`)
    }, 1500)
  }

  const handleReset = () => {
    setFormData({ company: '', role: '', jdText: '' })
    setIsEditMode(false)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900">
          {isEditMode ? 'Re-analyze Job Description' : 'Analyze Job Description'}
        </h2>
        {isEditMode && (
          <button
            onClick={handleReset}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Start Fresh
          </button>
        )}
      </div>

      {isEditMode && (
        <div className="mb-4 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
          <p className="text-sm text-indigo-800">
            💡 <strong>Editing mode:</strong> Saved analyses let you revisit and iterate without re-entering data. Make changes and re-analyze to see updated results.
          </p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Enter Job Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="e.g., Google, Microsoft, Amazon"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role / Position
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="e.g., Software Engineer, Frontend Developer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.jdText}
                onChange={(e) => setFormData({ ...formData, jdText: e.target.value })}
                required
                rows={12}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                placeholder="Paste the complete job description here..."
              />
              <p className="text-sm text-gray-500 mt-2">
                {formData.jdText.length} characters
              </p>
            </div>

            <button
              type="submit"
              disabled={!formData.jdText.trim() || isAnalyzing}
              className="w-full bg-primary hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  {isEditMode ? 'Re-analyze Job Description' : 'Analyze Job Description'}
                </>
              )}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
